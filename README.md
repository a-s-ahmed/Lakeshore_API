# Remote Monitoring and Control of a Lakeshore Cryogenic Controller 

Installation Instructions for Raspberry Pi:
TODO: Make this simpler
1. clone this repo and move mux_lakeshore and static/ into the same directory on your pi
2. Run "sudo chmod +x mux_lakeshore" and then you should be able to run the executable
3. Enjoy real-time remote monitoring and control over the Lakeshore controller.

If you're running it on windws, api_server.exe may work. Try recompiling if there is an error.

Important note: You may have to change api_server.go code to reflect the USB-serial port your pi assigned to the Lakeshore controller. In which case you'd need to cross-compile mux_lakeshore again. This is very simple, and you can find out more about that and more dev stuff in the dev.md

TODOS: 

Adjust UX slightly. It isn't the best right now.

Do further testing on writing the heater commands to the controller.

Write more in dev.md