//Backend of the Lakeshore Temperature Control website. We host the website on port 3012 and the API on 3011/output
//GET on 3012 calls the front-end. GET on 3011/output will get the latest readings from the Lakeshore while POST posts commands.


package main

import (
	"encoding/json"
	"log"
	"time"
	"bufio"
	"io"
	"github.com/jacobsa/go-serial/serial"
	"net/http"
	"fmt"
	"github.com/gorilla/mux"
)

//Input Data struct
type L_Data struct {
	A_Value     string  `json:"a_value"`
	B_Value     string  `json:"b_value"`
	C_Value     string  `json:"c_value"`
	D_Value     string  `json:"d_value"`
}


func get_temperature(data_channel chan L_Data, serialPort  io.ReadWriteCloser, scanner *bufio.Scanner){
	//Repeatedly get temperature from Lakeshore Controller, 1 command gets all 4 with the right input!
	//We parse string in the client code (plot.js) and this is sent to client via output_temperature which has 
	//a channel (data_channel) connected to this func

	//TODO: clean this up, ie remove b,c,d value and ensure it doesn't mess with the front-end (make sure plot.js doesnt use)
	
	
	for{
		//Query Lakeshore, ensure we have 50 m/s between calls. Include a timeout of 20 ms, if that is exceeded we write 0,0,0,0
		var latest_data L_Data
		time.Sleep(51 * time.Millisecond)
		serialPort.Write([]byte("KRDG? 0 \n"))
		fmt.Println("looper")
		c1 := make(chan L_Data, 1)
		go func() {
			if scanner.Scan(){
				latest_data.A_Value= scanner.Text()
				latest_data.B_Value = "f"
				latest_data.C_Value = "f"
				latest_data.D_Value = "f"
				// old_data = latest_data
				fmt.Println(scanner.Text())
			}else if (scanner.Err() != nil) {
				log.Fatal(scanner.Err())
			}
			c1 <- latest_data
		}()
		select {
			case res := <-c1:
				fmt.Println(res)
				data_channel<-res
			case <-time.After(20 * time.Millisecond):
				fmt.Println("timeout 1")
				latest_data.A_Value="0,0,0,0"
				data_channel<-latest_data
		}
		

		
	}
	
}


func input_post(w http.ResponseWriter, r *http.Request, serialPort  io.ReadWriteCloser ){
	//POST submissions from user to our server, then write them to Lakeshore 
	fmt.Printf("POSTEDDD")
	if err := r.ParseForm(); err != nil {
		fmt.Fprintf(w, "ParseForm() err: %v", err)
		return
	}
	fmt.Fprintf(w, "Post from website! r.PostFrom = %v\n", r.PostForm)
	fmt.Printf("Post from website! r.PostFrom = %v\n", r.PostForm)

	ulv_t := r.FormValue("ulv_hname")
	fmt.Fprintf(w, "ULV = %s\n", ulv_t)
	fmt.Printf("ULV = %s\n", ulv_t)

	ulv_dropdown := r.FormValue("ulv_dropdown")
	fmt.Fprintf(w, "ULV dropdown= %s\n", ulv_dropdown)
	fmt.Printf("ULV dropdown= %s\n", ulv_dropdown)

	braid_t := r.FormValue("braid_hname")
	fmt.Fprintf(w, "braid = %s\n", braid_t)
	fmt.Printf("braid = %s\n", braid_t)

	braid_dropdown := r.FormValue("braid_dropdown")
	fmt.Fprintf(w, "braid d = %s\n", braid_dropdown)
	fmt.Printf("braid d= %s\n", braid_dropdown)

	//TODO insert writing commands across serial-port here

	if(braid_dropdown !=""){
		//we got an input of braid dropdown Output 2 (Channel D)
		//TODO: TEST, I wasn't able to safely test the heaters so this code is commented out
		// ONLY WRITES OFF RIGHT NOW, See docs page 141 for easy fix

		//time.Sleep(51 * time.Millisecond)
		//serialPort.Write([]byte("RANGE 1,0 \n"))
		fmt.Printf("Braid heater command would be sent!")
	}else if(braid_t!="" ){
		//inputted temperature for the braid. Channel D Output 2
		//time.Sleep(51 * time.Millisecond)
		//serialPort.Write([]byte("SETP 2," + braid_t + " \n"))
	} else if(ulv_t!=""){
		//Channel A, OP 1
		fmt.Printf("ULV T!!!!")
		fmt.Printf(ulv_t)
		// time.Sleep(51 * time.Millisecond)
		// serialPort.Write([]byte("SETP 1," + ulv_t + " \n"))
	}
	if(ulv_dropdown !=""){
		//we got an input of ulv dropdown Output 1 (Channel A)
		//TODO: TEST, I wasn't able to safely test the heaters so this code is commented out
		// ONLY WRITES OFF RIGHT NOW, See docs page 141 for easy fix

		//time.Sleep(51 * time.Millisecond)
		//serialPort.Write([]byte("RANGE 1,0 \n"))
		fmt.Printf("Braid heater command would be sent!")
	}

}
func enableCors(w *http.ResponseWriter) {
	(*w).Header().Set("Access-Control-Allow-Origin", "*")
}

func output_temperature(w http.ResponseWriter, r *http.Request,data_channel chan L_Data, serialPort io.ReadWriteCloser ){
	//GET writes the temperatures to the front end. POST handles inputs from the front-end. Waiting only for inputs from the Lakeshore.
	
	switch r.Method {
		case "POST":
			//Get the input from the user
			w.Header().Set("Access-Control-Allow-Origin", "*")

			w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

			input_post(w,r,serialPort)
		case "GET": //GET
			//allow CORS and push data if there is a GET request
			w.Header().Set("Access-Control-Allow-Origin", "*") //Change second arg to "*"

			w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
			
			//Get data from Lakeshore (get_temperature) through a channel and update the API.
			data:= <- data_channel
			
			_ = json.NewDecoder(r.Body).Decode(&data)
			json.NewEncoder(w).Encode(data)
		default:
			//Necessary for xhttp GET to work, this is what governs the OPTIONS response
			w.Header().Set("Access-Control-Allow-Origin", "*")

			w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
			
			
	}

}


func serve_main(){
	//Serve main page in a separate goroutine so back-end stuff doesn't impact it.
	//time.Sleep(55 *time.Millisecond)
	http.ListenAndServe(":3012", nil)
}


func main() {

	// Initialize API router and channel to update data
	api_router := mux.NewRouter()
	//var latest_data L_Data
	data_channel :=make(chan L_Data)

	//Initialize Serial-port comms and begin getting temperature
	options := serial.OpenOptions{
        //Page 116
        PortName:        "/dev/ttyUSB0", // /dev/ttyUSB0 on the Pi, "COM4" or whatever your COM port is on desktop
		BaudRate:        57600,
        DataBits:        7,
        ParityMode:      1,
		StopBits:        1,
		
		//Set only one of these, theyre not specified by Lakeshore so I have no clue
		MinimumReadSize: 2, //Consider 4 if it doesnt work?
		//InterCharacterTimeout: 42,

		//Arduino for my tests at home
		// PortName: "COM3",
		// BaudRate:        9600,
        // DataBits:        8,
        // StopBits:        1,
        // MinimumReadSize: 4,
    }
    serialPort, err := serial.Open(options)
    if err != nil {
        log.Fatalf("serial.Open: %v", err)
    }
	defer serialPort.Close()
	reader := bufio.NewReader(serialPort)
    scanner := bufio.NewScanner(reader)
	
	//Start reading from the Lakeshore
	go get_temperature(data_channel,serialPort ,scanner)



	// Route handles & endpoints
	http.Handle("/", http.FileServer(http.Dir("./static/")))
	api_router.HandleFunc("/output",func(w http.ResponseWriter, r *http.Request){
		output_temperature(w,r,data_channel,serialPort)
	}).Methods("GET","OPTIONS","POST")

	// Start client and API
	go serve_main()
	http.ListenAndServe(":3011", api_router)
	
	//Close channel (Never Happens)
	<-data_channel
}