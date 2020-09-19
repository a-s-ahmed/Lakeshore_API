package main

import (
	"encoding/json"
	//"log"
	"time"
	//"bufio"
	//"io"
	//"github.com/jacobsa/go-serial/serial"
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


func hello(w http.ResponseWriter, r *http.Request) {

    if r.URL.Path != "/" {
        http.Error(w, "404 not found.", http.StatusNotFound)
        return
    }
 
    switch r.Method {
    case "GET":     
        // http.FileServer(http.Dir("./static"))
        // http.Handle("/", http.FileServer(http.Dir("./static")))
        http.ServeFile(w, r, "/static/")
        //fmt.Printf("We served GET")

    case "POST":
        // Call ParseForm() to parse the raw query and update r.PostForm and r.Form.
        fmt.Printf("POSTEDDD")
        if err := r.ParseForm(); err != nil {
            fmt.Fprintf(w, "ParseForm() err: %v", err)
            return
        }
        fmt.Fprintf(w, "Post from website! r.PostFrom = %v\n", r.PostForm)
        fmt.Printf("Post from website! r.PostFrom = %v\n", r.PostForm)

        ulv_push := r.FormValue("ulv_hname")
        fmt.Fprintf(w, "ULV = %s\n", ulv_push)
        fmt.Printf("ULV = %s\n", ulv_push)

        braid_push := r.FormValue("braid_hname")
        fmt.Fprintf(w, "braid = %s\n", braid_push)
        fmt.Printf("braid = %s\n", braid_push)

    default:
        fmt.Fprintf(w, "Sorry, only GET and POST methods are supported.")
    }
}


func get_temperature(data_channel chan L_Data){
	//Repeatedly get temperature from Lakeshore Controller, 1 command gets all 4 with the right input!
	//We parse string in the client code (plot.js) and this is sent to client via output_temperature which has 
	//a channel connected to this func
	
	var latest_data L_Data
	for{
		//Query Lakeshore, ensure we have 50 m/s between calls 
		//time.Sleep(51 * time.Millisecond)
		// serialPort.Write([]byte("KRDG? 0 \n"))
		// if scanner.Scan(){
		// 	//latest_data.A_Value= scanner.Text()
		// 	//fmt.Println(scanner.Text())
		// }
		// if scanner.Err() != nil {
		// 	//fmt.Println("HALLOOO")
		// 	log.Fatal(scanner.Err())
		// }
		latest_data.A_Value = "0,0,0,0"
		

		data_channel<-latest_data
	}
	

	//loc, _ := time.LoadLocation("CST")
	// loc, _ := time.LoadLocation("Canada/Saskatchewan")
	// //TODO, update to actually query
	// var latest_data L_Data
	// for {
	// 	//now := time.Now().In(loc)
	// 	now := time.Now().In(loc).Format("3:04PM")
	// 	latest_data.Value = "1"
	// 	latest_data.V_Date = now
	// 	data_channel <- latest_data
	// }

}


func input_post(w http.ResponseWriter, r *http.Request ){
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
		time.Sleep(51 * time.Millisecond)
		//serialPort.Write([]byte("SETP 1," + ulv_t + " \n"))
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

func output_temperature(w http.ResponseWriter, r *http.Request,data_channel chan L_Data){
	//Post Lakeshore temperature readings that are being updated in get_temperature() to front-end
	//fmt.Fprintf(w, "Sending values")
	//enableCors(&w)
	//Allow CORS here By * or specific origin
	switch r.Method {
		case "POST":
			input_post(w,r)
		default:
			w.Header().Set("Access-Control-Allow-Origin", "*")

			w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
			
			//fmt.Printf("Sending values")
			//w.Header().Set("Content-Type", "application/json")

			data:= <- data_channel
			_ = json.NewDecoder(r.Body).Decode(&data)
			json.NewEncoder(w).Encode(data)
	}

  
	
	// var data L_Data
	// _ = json.NewDecoder(r.Body).Decode(&data)
	// data.Value = "1" 
	// data.V_Date = "2"

	// encoder_stream:= json.NewEncoder(w)
	// encoder_stream.Encode(data)

	// data.Value = "3" 
	// data.V_Date = "4"
	// encoder_stream.Encode(data)

	// b, err := json.Marshal(data)
	// if err != nil {
	// 	fmt.Println("error:", err)
	// }
	// fmt.Printf(b)

}


func serve_main(){
	//Serve main page in a separate goroutine, only works reliably with nil router :/
	time.Sleep(55 * time.Millisecond)
	http.ListenAndServe(":3012", nil)
}


func main() {
	// Initialize API router and channel to update data
	api_router := mux.NewRouter()
	//var latest_data L_Data
	data_channel :=make(chan L_Data)

	//Initialize Serial-port comms and begin getting temperature
	// options := serial.OpenOptions{
    //     //Page 116
    //     PortName:        "/dev/ttyUSB1",
    //     BaudRate:        57600,
    //     DataBits:        7,
    //     ParityMode:      1,
    //     StopBits:        1,
    //     //MinimumReadSize: 4,
    // }
    // serialPort, err := serial.Open(options)
    // if err != nil {
	// 	//log.Fatalf("serial.Open: %v", err)
	// 	fmt.Printf("oh well")
    // }
	// defer serialPort.Close()
	// reader := bufio.NewReader(serialPort)
    // scanner := bufio.NewScanner(reader)
	
	go get_temperature(data_channel )



	// Route handles & endpoints
	http.Handle("/", http.FileServer(http.Dir("./static/")))
	//http.HandleFunc("/output", func(w http.ResponseWriter, r *http.Request){output_post(w,r,data_channel)})
	//api_router.HandleFunc("/input", input_post).Methods("POST")
	api_router.HandleFunc("/output",func(w http.ResponseWriter, r *http.Request){
		output_temperature(w,r,data_channel)
	}).Methods("GET","OPTIONS","POST")
	// Start client and API
	go serve_main()
	
	http.ListenAndServe(":3011", api_router)
	
	//Close channel (Never Happens)
	<-data_channel
}