<!DOCTYPE html>
<html lang="en">
    <head>
    <meta http-equiv="content-type" content="text/html; charset=UTF-8" />
    <meta charset="utf-8">
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.26.0/moment.min.js" integrity="sha512-QkuqGuFAgaPp3RTyTyJZnB1IuwbVAqpVGN58UJ93pwZel7NZ8wJOGmpO1zPxZGehX+0pc9/dpNG9QdL52aI4Cg==" crossorigin="anonymous"></script>
    <script src="https://cdn.plot.ly/plotly-latest.min.js"></script>
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <!-- <meta http-equiv="X-UA-Compatible" content="ie=edge"> -->
    <!-- <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" integrity="sha384-JcKb8q3iqJ61gNV9KGb8thSsNjpSL0n8PARn9HuZOnIxN0hoP+VmmDGMN5t9UJ0Z" crossorigin="anonymous"> -->
    <link rel="stylesheet" href= "test.css"> 
    </head>
    <body>
        <script src="https://code.jquery.com/jquery-3.2.1.slim.min.js" integrity="sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN" crossorigin="anonymous"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js" integrity="sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q" crossorigin="anonymous"></script>
        <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js" integrity="sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl" crossorigin="anonymous"></script>
  
        <!-- <script src="https://code.jquery.com/jquery-3.5.1.slim.min.js" integrity="sha384-DfXdz2htPH0lsSSs5nCTpuj/zy4C+OGpamoFVy38MVBnE+IbbVYUew+OrCXaRkfj" crossorigin="anonymous"></script>
        <script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.1/dist/umd/popper.min.js" integrity="sha384-9/reFTGAW83EW2RDu2S0VKaIzap3H66lZH81PoYlFhbGU+6BZp6G7niu735Sk7lN" crossorigin="anonymous"></script>
        <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js" integrity="sha384-B4gt1jrGC7Jh4AgTPSdUtOBvfO8shuf57BaghqFfPlYxofvL8/KUEfYiJOMMV+rV" crossorigin="anonymous"></script> -->

        <!-- Header -->
        <nav class="navbar navbar-expand-lg bg-dark fixed-top py-lg-0 my-own-style">
            <div class="container">
            <a href="#" class = "navbar-brand">
                    <img src="./canadian-light-source-logo-svg-vector.svg" alt="Brand" >
                </a>
            <p class="navbar-text">ARPES Cryostat Temperature</p>
            <p id="navtest"></p>
            </div>
        </nav>

        <!--User input-->
        
        <div class = "container-fluid scroll  "><!--  "force-bottom" -->
            <div id="chart"></div>
            <div class="d-flex justify-content-around">

                <iframe name = "iframe_ulv" style="display: none;"></iframe> <!-- allows us to submit post without reloading -->
                <table>
                    <tr>
                        <td style="text-align:center;">
                            <b>ULV - Channel A</b>
                        </td>
                    </tr>


                    <tr > 
                        <td > <!-- style="text-align:center;" -->
                            <form method="POST" class="form-inline" name="ulv_heat_form" target = "iframe_ulv">
                                <div class="form-group mb-2">
                                    <!-- <label class="pr-2 mb-2" for="ulv_dropdown_id">ULV/Channel A Heater</label> -->
                                        <div class="input-group mb-2 mr-sm-2">
                                            <select name="ulv_dropdown" id="ulv_dropdown_id">
                                                <option value="ulv_off">Off</option>
                                                <option value="ulv_low">Low</option>
                                                <option value="ulv_medium">Medium</option>
                                                <option value="ulv_high">High</option>
                                            </select>
                                        </div>
                                        <button type="submit" formmethod="POST" formtarget="iframe_ulv" formaction="http://localhost:3011/input" name="ulv_sub"  class="btn btn-primary mb-2" >Set Heater Range</button>
                                </div>
                            </form>
                        </td>
                    </tr>


                    <tr>
                        <td > <!-- style="text-align:center;" -->
                            <form method="POST" class="form-inline" name="ulv_form" onsubmit ="doSubmit('ulv')" target = "iframe_ulv" >
                                <div class="form-group mb-2">
                                    <!-- <label class="pr-2 mb-2" for="ulv">ULV - Channel A (Kelvins): </label> -->
                                    <div class="input-group mb-2 mr-sm-2">
                                        <input type="hidden" id="ulv_h" value =-1 name="ulv_hname" /> <!--to be used as target val-->
                                        <input type="number" name ="ulv_const" class="form-control" id="ulv" placeholder=300> 
                                    </div>
                                    <button type="submit" formmethod="POST" formtarget="iframe_ulv" formaction="http://localhost:3011/input" name="ulv_sub"  class="btn btn-primary mb-2" >Set Temperature (K)</button>
                                </div>
                            </form>
                        
                        </td>
                    </tr>

                </table>

                <iframe name = "iframe_braid" style="display: none;"></iframe> <!-- allows us to submit post without reloading -->
                
                <table>
                    <tr>
                        <td style="text-align:center;">
                            <b>Top-Braid - Channel A</b>
                        </td>
                    </tr>

                    <tr>
                        <td>
                            <form method="POST" class="form-inline" name="braid_heat_form" target = "iframe_braid">
                                <div class="form-group mb-2">
                                    <div class="input-group mb-2 mr-sm-2">
                                        <select name="braid_dropdown" id="braid_dropdown_id">
                                            <option value="braid_off">Off</option>
                                            <option value="braid_low">Low</option>
                                            <option value="braid_medium">Medium</option>
                                            <option value="braid_high">High</option>
                                        </select>
                                    </div>
                                    <button type="submit" formmethod="POST" formtarget="iframe_braid" formaction="http://localhost:3011/input" name="braid_sub"  class="btn btn-primary mb-2" >Set Heater Range</button>
                                </div>
                            </form>
                        </td>
                    </tr>

                    <tr>
                        <td>
                            <form method="POST" class="form-inline" name="braid_form" onsubmit ="doSubmit('braid')" target="iframe_braid">
                                <div class="form-group mb-2">
                                    <!-- <label class="pr-2 mb-2" for="braid">Top-braid/Channel D Temperature and Heater: </label> -->
                                    <!-- <label class="pr-2 mb-2" for="braid_dropdown"> Heater Range - Channel D: </label> -->
                                    <div class="input-group mb-2 mr-sm-2">
                                        <input type="hidden" id="braid_h" value =-1 name="braid_hname"/> <!--to be used as target val-->
                                        <input type="number" name="braid_const" class="form-control" id="braid" placeholder="300">
                                    </div>
                                    <button type="submit" formmethod="POST" formtarget="iframe_braid" formaction="http://localhost:3011/input" name="braid_sub" class="btn btn-primary mb-2">Set Temperature</button>
                                </div>
                            </form>
                        </td>
                    </tr>


                </table>


                
            </div>
        </div>

        <div class="wrapper">
            
            <script type ="text/javascript" src = "./plot.js">
            </script>
        </div>
    </body>
</html>