 /* ========================================================================
 *
 *    Project:          Javascript Work Day Scheduler
 *    Javascript file:  main.js
 *    Created by:       Mark Watson
 *    Date commenced:   17-Sep-2021
 *    
 *    Pseudo:   => 1. display dynamic date in header .
 *              => 2. table below header. 
 *              => 3. 12 rows - 8AM to 8PM.
 *              => 4. each row to have 3 cells: i.   time, 
 *                                              ii.  input text for tasks,
 *                                              iii. save button
 *              => 5. rows to be coloured with time - past, present hour & future.
 *              => 6. clicking save button saves user input to local storage.         
 * 
 *=========================================================================== */

let currentTime    = $( "#currentDay" );
let schedStart     = document.getElementById( "startDay" );
let schedEnd       = document.getElementById( "endDay" );
let scheduleStart, scheduleEnd;


/* ========================================================================== */ 

schedStart.addEventListener( "change", ( event ) => {

    scheduleStart = event.target.value;
    localStorage.setItem( "schedStart", scheduleStart );
    location.reload();

});

  /* ========================================================================== */ 

schedEnd.addEventListener( "change", ( event ) => {

    scheduleEnd = parseInt(event.target.value);
    scheduleEnd = scheduleEnd + 12; 

    localStorage.setItem( "schedEnd", scheduleEnd );
    location.reload();

});

/* ========================================================================== */ 

window.addEventListener("load", function (){

    // this was needed for 1st run - as there is no value in local storage.
    if ( localStorage.getItem( "schedStart" ) !== null ) {   
        scheduleStart   = parseInt( localStorage.getItem( "schedStart" ));
    } else {
        scheduleStart = 8;
    }

    // this was needed for 1st run - as there is no value in local storage.
    if ( localStorage.getItem( "schedEnd" ) !== null ) {   
        scheduleEnd   = parseInt( localStorage.getItem( "schedEnd" ));
    } else { 
        scheduleEnd = 19;
    }

        schedStart.value    = scheduleStart;
        schedEnd.value      = scheduleEnd - 12;
      
        let tblSchedule  = $( ".container" )[1];  
        let tblContainer = document.createElement( "DIV" );
        let table        = document.createElement( "TABLE" );
        let tableBody    = document.createElement( "TBODY" );

        tblContainer.setAttribute( "class", "table-responsive-md" );
        table.setAttribute( "id", "taskSchedule" );
        table.setAttribute( "class", "table" );
        tableBody.setAttribute( "id","tblBody" );
        
        table.appendChild(tableBody);
          
        for ( let i = scheduleStart;  i <= scheduleEnd; i++ ){
           
            let tr = document.createElement( "TR" );
            tr.setAttribute( "id", "hour" + i )
            
            tableBody.appendChild( tr );
           
            for ( let cols=0; cols<3; cols++ ){
               
                let td = document.createElement( "TD" );
                
                    if( cols===0 ){ 

                        td.setAttribute( "class", "time-blocks col-1" ); 
                            if ( i < 12 ) {
                                td.appendChild(document.createTextNode( i + "AM" ));
                            } if ( i > 12 ) {                                
                                td.appendChild(document.createTextNode( i-12 + "PM" ));
                                    } else if ( i === 12) {
                                        td.appendChild(document.createTextNode( "midday" ));  
                                    }
                    }

                    if( cols===1 ){ 
                        td.setAttribute( "class", "col-9 cell-container" );
                        let txtarea = document.createElement( "TEXTAREA" );
                        txtarea.setAttribute( "class", "col-12");
                        txtarea.setAttribute( "id", "task"+i );
                        txtarea.setAttribute( "onchange", "saveLocalMemoryOnChange( this )" );
                        td.appendChild( txtarea );
                    }

                    if( cols===2 ){   // I couldn't find a shorter way to set all these attributes.
                        td.setAttribute( "class","btn col-12 col-md-7 col-lg-4 saveBtn icon-SVG_HDD_icon" );
                        td.setAttribute( "type","button" );
                        td.setAttribute( "onclick","saveLocalMemory( this )" );
                        td.setAttribute( "oncontextmenu","deleteLocalMemory( this )" );
                        td.setAttribute( "data-toggle","tooltip" );
                        td.setAttribute( "data-placement","top" );
                        td.setAttribute( "title","***Right click to delete record.***" );
                    }

                    tr.appendChild(td);
                }
        }
        tblSchedule.appendChild(tblContainer);
        tblContainer.appendChild(table);

        localStorage.setItem("schedStart", scheduleStart);
        localStorage.setItem("schedEnd", scheduleEnd);

        hourTracker(); 
        date_time();
});

/* ============================================================================ */ 

function date_time() {
    now = moment().format( "ddd, Do MMMM YYYY  |  HHmm[hrs]" );
    currentTime.text(now);   

    setInterval(function () { date_time(); }, 60000); // refreshing every 60 seconds

    if ( moment().minute()===0 ) { hourTracker(); }  // auto update the cell shading 
                                                     // to match current hour.
};

/* ============================================================================ */ 

function saveLocalMemory ( whoCalled ) {

    let taskCell   = whoCalled.previousSibling.children[0].value; 
    let time       = whoCalled.parentElement.id; 

    localStorage.setItem(time, taskCell);
};

/* ============================================================================ */ 

// This is pretty much a repeat of saveLocalMemory() function but set up to 
// to auto save.  As the DOM element reference is different, a new function was
// needed.
// This function saves users having to click the save button, you can tab between 
// the hours and the task is auto-saved.

function saveLocalMemoryOnChange ( whoCalled ) {

    console.log(whoCalled);
    
    let taskCell   = whoCalled.value; 
    let time       = whoCalled.parentElement.parentElement.id; 

    localStorage.setItem(time, taskCell);
};

/* ============================================================================ */ 

function deleteLocalMemory ( whoCalled ) {

    // I'm not liking this approach - prefer a button as after function runs, the
    // context menu stays open and my research suggests you can not then by code
    // close the menu.  Tried 'selecting' the <textarea> after the delete but I
    // couldn't get it to work.
    
    let taskCell   = whoCalled.previousSibling.children[0].value; 
    let time       = whoCalled.parentElement.id; 

    if( taskCell === "" ) { return; }

    let confirmDelete = confirm( "Please confirm:\n" +
                                 "----------------\n\n" + 
                                 "Proceed with deleting the record?" );

    if ( confirmDelete ) { 
        localStorage.removeItem( time ); 
        location.reload();  
    }
};

/* ============================================================================ */ 

window.onload = function(){

    for( n=scheduleStart; n <= scheduleEnd; n++ ) {

    let renderTask = document.getElementById( "task"+n );
        renderTask.value = localStorage.getItem( "hour" + n  );
    };
};

/* ============================================================================ */ 

function hourTracker() {
    
    let now = moment().hour(); 
    let n = 0;

        $("tr").each(function () {
            
            let currentHour     = parseInt($(this).attr("id").split("hour")[1]);
            let timeBackground  = document.querySelectorAll(".cell-container")[n];            

            if ( currentHour < now ) {
                timeBackground.style.backgroundColor = "rgb(170, 170, 170)";
            }
            else if ( currentHour === now ) {
                timeBackground.style.backgroundColor = "rgb(255, 80, 80)";
            }
            else {
                timeBackground.style.backgroundColor = "rgb(115, 210, 100)";
            }
            n++
        })
};

/* ============================================================================ */ 


