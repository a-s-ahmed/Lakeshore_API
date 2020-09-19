# Development

## Cross-compiling
If running on a raspberry Pi but developing on a regular computer we need to cross compile to the Raspberry Pi's architecture and OS, this process differs slightly on Windows and Mac but there are ample resources online. For windows, goto cmd prompt and navigate to this directory, then do

set GOOS=linux GOARCH=arm GOARM=7
go build

and your new mux_lakeshore should compile. I dont use Mac, but from my understanding you should replace "set" with "env" for Mac. Be careful of doing the set statements on different lines, spaces after "linux " for example may cause errors.

## High-level overview on how it all works
If you're planning on expanding on this you'll probably want to know how it works. At a high-level this can be thought of as 2 separate projects, an API that let's you interact with the Lakeshore controller through simple GET and POST requests to :3011/output, and a front-end that runs on port :3012 while repeeatedly interacting with that API. Exposing the API and front-end are taken care of by mux routers in go on separate goroutines to allow for concurrent operation. We also query and send commands across the serial-port to the Lakeshore controller. The manual is available online on Lakeshore's website and is very thorough.

You may be interested in replacing the serial communication with TCP communication, that upgrade should be trivial given you'd interact with it the same exact way as a serial-port, but it has the added benefit of not needing the Pi physically connected to the controller. Read the manual for more details on how to accomplish that.

You may also be interested in doing this in Python. While it may work, Go has many benefits I discuss later in this document.

## Can this only run on a Raspberry Pi?
No! Thats the beauty of Go and a simple RESTful API approach. We can write once and compile for anywhere. The only changes you may need to make are for the COM/ttyUSB port number.


## Dependencies
Mostly standard libraries, the only thing that may not be standard is my choice of package for go-serial. There are many out there, this is the only one I found that guaranteed enough costumizability (ie stop bits, odd-parity etc.) for the Lakeshore and was explicitly stated to not depend on anything that would make cross-compiling to ARM difficult.

## Why aren't my commands being reflected on the Lakeshore?
For safety reasons I've commented out the code that actually prints the commands accross the serial. They are there, and to my knowledge they are accurate, but you should double check before enabling them.

## What are the most pressing issues?
Add more functionality? But mostly making the UI a little more appealing, it looks good right now but some things are slightly off-centre.

## Why Go?
Much much much faster than python which is extremely important when working with such little memory. The built in concurrency helped a ton, and unlike Python it is a compiled language so mistakes were caught before run-time

## Why not gRPC?
web-gRPC only has one-way streams to my knowledge and I figured a RESTful API would be better in the long run. Even if you want to toss out the front-end completely you can still just interact with the API seamlessly.

## Final thoughts and tips for future additions
Do not underestimate the importance of CORS headers to ensure your localhost GET/POST requests go through. They are essential. And with CORS comes ensuring OPTIONS is supported. Without accounting for that, it won't work.

Keep the channels and concurrency simple, in it's current state there are only 3 goroutines, the main one which ends up exposing the API, the one that deals with displaying the website, and the one that deals with getting readings from the Lakeshore.

Is this code clean and understandable? Yes. Could it use some refactoring to further separate the client stuff from the server stuff? Yes!

## temp_saves ?
Just some past versions for posterity's sake. They shouldn't impact building your program since ive changed the .go to .md but they may be helpful for testing and future work.

## Where can I reach you for more specific dev advice
Before this project I had very little experience with Go but a LOT of arduino experience which was helpful when it came to dealing with the controller. But..I had no experience at all with webdev. It was quite the journey but I'm more than willing to help with anything tangentially related to a project like this, even if it's just setting up Raspberry Pi's for tangible computing projects. I've learned countless small quirks about how Go, HTML, JS, and Raspbian work that I wouldn't mind sharing if it means someone else doesn't have to go through the same trouble. You can reach me at asahmed2@ualberta.ca
