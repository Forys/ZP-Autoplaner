 

var questionsArray = [];
questionsArray[1] = "1. Kiedy grasz mecz?";
questionsArray[2] = "2. Kiedy trenujesz z drużyną?";
questionsArray[3] = "3. Kiedy chcesz zrobić trening Mistrz Techniki?";
questionsArray[4] = "4. Kiedy trenujesz na siłowni";


var questionsBlocksArray = [];
questionsBlocksArray[1] = "Mecz";
questionsBlocksArray[2] = "Trening Drużynowy";
questionsBlocksArray[3] = "Trening Indywidualny";
questionsBlocksArray[4] = "Siłownia";

var blockName; 
var currentQuestion = 1;
var gymBlocksCount = 0;
var individualBlocksCount = 0;
var i = false; 

// variable to store data about empty individual trainings blocks to assign them later 
// [ [date,index], [date,index], (...) ,[date,index] ]
var individualTrainingBlocks = [];
var trainingTypesArray = [];
// variable to store data about empty gym blocks to assign them later 
// [ [date,index], [date,index], (...) ,[date,index] ]
var gymBlocks = [];
var gymTypesArray = [];

var assignedIndividualTrainings;
var assignedGymTrainings;

$(document).ready(function() {

    $(document).on("click", '.auto-planer-pre-btn', function() {
        $('.auto-planer-pre-wrap').addClass('hidden');
        $('.auto-planer-phase1-wrap').removeClass('not-visible');
        $('.week-preview-container').removeClass('not-visible');
        $('.auto-planer-phase1-wrap').removeClass('hidden');
        $('.week-preview-container').removeClass('hidden')
        currentQuestion =1;
        changeQuestion(currentQuestion);

         $.ajax({
                type: "post",

                url: "/wp-admin/admin-ajax.php",

                data: {
                    action: 'markAutoPlanerWelcome'
                },
                success: function(data) {
                    //console.log('Zapisane');
                },
                error: function(errorThrown) {
                    //////console.log(errorThrown);
                }
            });
    });


    //setting up a initial question and a block name in changeQuestion function
    var workoutCellWidth = $('.workout-cell').width();
    $('.workout-cell').css({'height':workoutCellWidth+'px'});

    changeQuestion(currentQuestion);

    if ($.cookie('planerDate')){
        //console.log('planerDate Cookie', $.cookie('planerDate'));  
        var planerDate=  $.cookie('planerDate');   
        $.removeCookie("planerDate", { path: '/' });
        var today = moment(planerDate);
    } else {
        var today = moment();
    }
   // today.add(20,'days');
    fillTheWeek(today);
  
    $(document).on("click", '.auto-planer-day-btn ', function(e) {
        e.preventDefault();
        var dataDay = $(this).attr("data-day");
        //console.log('dataDay',dataDay);
        if ($(this).hasClass('active')){
            clearWeekDayCell(dataDay,blockName);
        } else {
            fillEmptyWeekDay(dataDay, blockName);
        }
        $(this).toggleClass('active');
        $(this).toggleClass('auto-planer-day-btn-inactive');
    });

    $(document).on("click", '.workout-cell-empty', function(e) {
        e.preventDefault();
        var dataDay = $(this).parent().attr("data-day");
        //console.log('dataDay',dataDay);
        fillClickedEmptyCell(dataDay, blockName, $(this));
        clickAutoPlanerDayButton(dataDay);
    });

    $(document).on("click", '.workout-cell-filled', function(e) {
        e.preventDefault();
        var dataDay = $(this).parent().attr("data-day");
        //console.log('dataDay',dataDay);
        clearClickedWeekDayCell(dataDay,blockName, $(this)); 
    });

    $(document).on("click", '.auto-planer-next', function() {
        //console.log('currentQuestion',currentQuestion); 
        if (currentQuestion<3){
            currentQuestion++;
            changeQuestion(currentQuestion);
            clearDayButtonsFromActiveClass(); 
        } else {
            changeScheduleClickingBehaviorClass();
            autoplanerPhaseTwo();
            countTrainingAndGymBlocks();
            determineTraining();

        }
    });

    $(document).on("click", '.auto-planer-back-btn', function() {
        currentQuestion--;
        changeQuestion(currentQuestion);
        clearDayButtonsFromActiveClass(); 
    });

    $(document).on("click", '.auto-planer-back', function() {
        currentQuestion--;
        changeQuestion(currentQuestion);
        clearDayButtonsFromActiveClass(); 
    });

    $(document).on("click", '.phase-2-next', function() {
        var questionType = $(this).attr("data-questionType");
        var questionarrayindex = $(this).attr("data-questionarrayindex"); 

        if ($(this)[0].hasAttribute("data-answer")){
            var answer = $(this).attr("data-answer"); 
            if (questionType == 'individual'){
                individualTrainingBlocks[questionarrayindex][2] = answer;
                trainingTypesArray.push(answer);
            }
            if (questionType == 'gym'){
                gymBlocks[questionarrayindex][2] = answer;
                gymTypesArray.push(answer);
            }
            $('.active-question').addClass('question-resolved');
            determineTraining();
        }
        
        //console.log('individualTrainingBlocks',individualTrainingBlocks);
        //console.log('trainingTypesArray',trainingTypesArray);

       $('.active-answer').removeClass('active-answer');
    });

    $(document).on("click", '.individual-answer-btn', function(e) {
        e.preventDefault();
        $(this).addClass('active-answer');
        //console.log('bluured');
         $('.phase-2-next').attr('data-answer', $(this).attr('data-trainingslug'));
          $('.phase-2-next').click();
    });

    $(document).on("click", '.question-cell', function() {
        $(this).removeClass('question-resolved');
        var type = $(this).attr('data-type');
        var date = $(this).parent().attr('data-day');
        var index = $(this).attr('data-index');
        var arrayIndex = $(this).attr('data-blocksArrayIndex');
        generateQuestion(type, date, index, arrayIndex);
    });

    $(document).on("click", '.btn-register', function() {
        $('.register-form').removeClass('hidden');
    });

    $('#register-form').validate({ // initialize the plugin
        rules: {
            email: {
                required: true,
                email: true
            },
            login: {
                required: true
            },
            password: {
                required: true
            },
            privacy: {
                required: true
            }
        },
        messages :{
            email : {
                required : 'Wprowadź poprawny email'
            },
            login : {
                required : 'Wprowadź login'
            },
             password : {
                required : 'Wprowadź hasło'
            },
            privacy: {
                required: 'Proszę zaakceptować naszą politykę prywatności'
            }
        },
        submitHandler: function (form) { // for demo
            var newUserName = JSON.stringify($('#login').val());
            var newUserEmail = JSON.stringify($('#email').val());
            var newUserPassword = JSON.stringify($('#password').val());
            $('#register-button').prop('disabled', true);
            $('#register-text').removeClass('hidden');
            $.ajax({
              type:"POST",
              url: "/wp-admin/admin-ajax.php",
              data: {
                action: "register_user_front_end",
                new_user_name : newUserName,
                new_user_email : newUserEmail,
                new_user_password : newUserPassword
              },
              success: function(results){
                //console.log('results',results);
                if (results == 'sukces0'){
                    //console.log('sukce2dsas');
                    window.location.replace(/dziekujemy/); 
                } else {
                    $('#register-text').text(results); 
                    $('#register-button').prop('disabled', false);
                }
                
              },
              error: function(results) {
                $('#register-text').text(results); 
                $('#register-button').prop('disabled', false);
              }
            });

            
            return false; // for demo
        }
    });



});



/* HELPERS FUNCTIONS */
        function fillTheWeek(todayDate) {
            var i = 1;
            var tmpdate = todayDate.clone();
            var tmpdate2 = todayDate.clone();
            var weekStart = $('.week-start');
            var weekEnd = $('.week-end');
            var daysTD = $('.days-tr td');
            var emptyWorkoutDayArray = [['empty', false] , ['empty', false] , ['empty', false]];

            var weekStartDate = tmpdate.locale('pl').format('ddd. D.MM');
            weekStart.text(weekStartDate);
            weekStart.attr("data-day", tmpdate.format('L'));
            var weekEndDate = tmpdate.add(6,'days').locale('pl').format('ddd. D.MM');
            weekEnd.text(weekEndDate);
            weekEnd.attr("data-day", tmpdate.format('L'));

            // filling dates td
            daysTD.each(function() {
                
                var dateFormatted = todayDate.format('L'); 

                //fill in array with empty values if not defined
                // EDIT : CANNOT DO IT HERE BECAUSE OBJECT IN scheduleArray had the same refference and was causing conflicts
                /*if (scheduleArray.workouts[dateFormatted] == undefined) {
                    scheduleArray.workouts[dateFormatted] = emptyWorkoutDayArray;
                }*/

                var dataPolska = todayDate.clone();
                $(this).attr("data-day", todayDate.format('L'));
                $('.auto-planer-day-btn-'+i).attr("data-day", todayDate.format('L'));
                $('.workout-day-'+i+'-column').attr("data-day", todayDate.format('L'));

                $(this).find('.day-number').text(dataPolska.locale('pl').format('D'));
                $('.auto-planer-day-btn-'+i).text(dataPolska.locale('pl').format('ddd.'));
                $(this).find('.day-text').text(dataPolska.locale('pl').format('ddd.'));
            
                todayDate.add(1,'days');
                i++;
            });
        }

        function generateFinalSchedule(assignedTrainingsArray, assignedGymArray){
            //console.log('generateFinalSchedule');
            //console.log(assignedTrainingsArray);
            //console.log(assignedGymArray);
            //console.log(scheduleArray);
            var date,index,workoutName;
            var emptyWorkoutDayArray = [['empty', false] , ['empty', false] , ['empty', false]];

            if ( individualTrainingBlocks.length != 0){
                for (var i = 0; i < individualTrainingBlocks.length ; i++) {
                    if (individualTrainingBlocks[i][2]){
                        if (assignedTrainingsArray[i] == null ){
                            individualTrainingBlocks[i][2] = "Kreator Treningu"
                        } else {
                            individualTrainingBlocks[i][2] = assignedTrainingsArray[i];
                        }
                    }

                    date = individualTrainingBlocks[i][0];
                    index = individualTrainingBlocks[i][1];
                    workoutName = individualTrainingBlocks[i][2];

                    // here we are editing schedule Array of user 
                    scheduleArray.workouts[date][index][0] = workoutName;
                } 
            } 

            if ( gymBlocks.length != 0){
                for (var i = 0; i < gymBlocks.length ; i++) {
                    if (gymBlocks[i][2]){
                        if (assignedGymArray[i] == null ){
                            gymBlocks[i][2] = "Siłownia"
                        } else {
                            gymBlocks[i][2] = assignedGymArray[i];
                        }
                    }

                    date = gymBlocks[i][0];
                    index = gymBlocks[i][1];
                    workoutName = gymBlocks[i][2];

                    // here we are editing schedule Array of user 
                    scheduleArray.workouts[date][index][0] = workoutName;
                } 
            } 

            // here we loop throught weekly schedule to check if user has any empty days
            // if so we replace "empty" with "Recovery" block 
            var daysTD = $('.days-tr td');
            daysTD.each(function() {
                var date = $(this).attr("data-day");
                var workoutArray = scheduleArray.workouts[date];
                /* checking if day is empty */
                var empty = true;
                if (typeof workoutArray != 'undefined') {
                    for (var x = 0; x < workoutArray.length; x++) {
                        if (workoutArray[x][0] != 'empty') {
                            empty = false;
                        }
                    }
                }
                if (empty){
                    //fill in array with empty values if not defined
                    if (scheduleArray.workouts[date] == undefined) {
                        scheduleArray.workouts[date] = emptyWorkoutDayArray;
                    }
                    scheduleArray.workouts[date][0][0] = "Regeneracja";
                }
            })
            
            //sending updated array to database
            var dataToSend = JSON.stringify(scheduleArray);
            //console.log('zapisuje Cookie');
            $.cookie('scheduleArray', dataToSend, {
                path: '/'
            });
            // This does the ajax request
            $.ajax({
                type: "post",

                url: "/wp-admin/admin-ajax.php",

                data: {
                    action: 'saveSchedule',
                    schedule: dataToSend,
                },
                success: function(data) {
                    //console.log('Plan zapisany!');
                },
                error: function(errorThrown) {
                    //////console.log(errorThrown);
                }
            });

        }

        function fillEmptyWeekDay(date, workoutName){

            var sanitizedWorkoutName = workoutName.replace(/\s+/, "-");
            var tableColumn = $(".workout-day-column[data-day='" + date +"']");
            var emptyCell = $(tableColumn).find('.workout-cell-empty:first'); // first div with data-item=0
            var index = emptyCell.attr("data-index");
            var emptyWorkoutDayArray = [['empty', false] , ['empty', false] , ['empty', false]];

             //fill in array with empty values if not defined
            if (scheduleArray.workouts[date] == undefined) {
                scheduleArray.workouts[date] = emptyWorkoutDayArray;
            }
            scheduleArray.workouts[date][index][0] = workoutName; // filiing in block name field
            scheduleArray.workouts[date][index][1] = false; //here filling in completed field

            emptyCell
                .addClass('block-'+ sanitizedWorkoutName +'-bg')
                .attr('data-block',sanitizedWorkoutName)
                .addClass('workout-cell-filled')
                .addClass(sanitizedWorkoutName+'-block')
                .removeClass('workout-cell-empty');

            //console.log('scheduleArray after fillEmptyWeekDay', scheduleArray);
        }

        function clearWeekDayCell(date,workoutName){
         
            var sanitizedWorkoutName = workoutName.replace(/\s+/, "-");
            var tableColumn = $(".workout-day-column[data-day='" + date +"']");
            var filledCell = $(tableColumn).find('.' + sanitizedWorkoutName + '-block:first'); //  here we are looking for specific block 
            var index = filledCell.attr("data-index");

            //console.log('index' , index);

            scheduleArray.workouts[date][index][0] ='empty'; // filiing in block name field
            scheduleArray.workouts[date][index][1] = false; //here filling in completed field

            filledCell
                .removeClass('block-'+ sanitizedWorkoutName +'-bg')
                .removeClass('workout-cell-filled')
                .removeAttr('data-block')
                .removeClass(sanitizedWorkoutName+'block')
                .addClass('workout-cell-empty');

            //console.log('scheduleArray after clearWeekDayCell', scheduleArray);
        }

        function clickAutoPlanerDayButton(date){
            var dayButtons = $('.auto-planer-day-btn');
            dayButtons.each(function() {
                if( $(this).attr('data-day') == date){
                    $(this).addClass('active');
                    $(this).removeClass('auto-planer-day-btn-inactive');
                }
                
            });
        }

        function unclickAutoPlanerDayButton(date){
            var dayButtons = $('.auto-planer-day-btn');

            dayButtons.each(function() {
                if( $(this).attr('data-day') == date && $(this).hasClass('active')){
                    $(this).removeClass('active');
                    $(this).addClass('auto-planer-day-btn-inactive');
                }
                
            });
        }

        function fillClickedEmptyCell(date, workoutName, clickedEmptyCell){
            var sanitizedWorkoutName = workoutName.replace(/\s+/, "-");

            var emptyCell = clickedEmptyCell;
            var index = emptyCell.attr("data-index");
            var emptyWorkoutDayArray = [['empty', false] , ['empty', false] , ['empty', false]];

             //fill in array with empty values if not defined
            if (scheduleArray.workouts[date] == undefined) {
                scheduleArray.workouts[date] = emptyWorkoutDayArray;
            }
            scheduleArray.workouts[date][index][0] = workoutName; // filiing in block name field
            scheduleArray.workouts[date][index][1] = false; //here filling in completed field

            emptyCell
                .addClass('block-'+ sanitizedWorkoutName +'-bg')
                .attr('data-block',sanitizedWorkoutName)
                .addClass('workout-cell-filled')
                .addClass(sanitizedWorkoutName+'-block')
                .removeClass('workout-cell-empty');

            //console.log('scheduleArray after fillEmptyWeekDay', scheduleArray);
        }

        function clearClickedWeekDayCell(date,workoutName,ClickedWeekDayCell){
            
            var clickedWorkoutName = ClickedWeekDayCell.attr('data-block');

            var filledCell =  ClickedWeekDayCell;
            var index = filledCell.attr("data-index");

            //console.log('index' , index);

            scheduleArray.workouts[date][index][0] ='empty'; // filiing in block name field
            scheduleArray.workouts[date][index][1] = false; //here filling in completed field

            filledCell
                .removeClass('block-'+ clickedWorkoutName +'-bg')
                .removeAttr('data-block')
                .removeClass('workout-cell-filled')
                .removeClass(clickedWorkoutName+'block')
                .addClass('workout-cell-empty');

            if (clickedWorkoutName == workoutName) {
                unclickAutoPlanerDayButton(date);
            }
            

            //console.log('scheduleArray after clearClickedWeekDayCell', scheduleArray);
        }

        function clearDayButtonsFromActiveClass(){
            var dayButtons = $('.auto-planer-day-btn');

            dayButtons.each(function() {
                $(this).removeClass('active');
                $(this).addClass('auto-planer-day-btn-inactive');
            });
        }

        function changeQuestion(questionNumber){
            if (questionNumber == 0 ){
                $('.auto-planer-phase1-wrap').addClass('not-visible');
                $('.week-preview-container').addClass('not-visible');
                $('.auto-planer-phase1-wrap').addClass('hidden');
                $('.week-preview-container').addClass('hidden');
                $('.auto-planer-pre-wrap').removeClass('hidden');
                return
            } else {
                $('.auto-planer-question').text(questionsArray[questionNumber]);
                         
                //removing previous question thumbnail
                $('.auto-planer-question-thumbnail').attr('class', 'auto-planer-question-thumbnail');
                
                // adding new question thumbanail
                blockName = questionsBlocksArray[questionNumber];
                var sanitizedBlockName = blockName.replace(/\s+/, "-");
                $('.auto-planer-question-thumbnail').addClass('block-'+ sanitizedBlockName +'-bg');
                return;
            }
            
        }

        function changeScheduleClickingBehaviorClass(){
            $('.workout-cell-filled').addClass('question-cell');
            $('.workout-cell-filled').removeClass('workout-cell-filled');
        }

        function autoplanerPhaseTwo(){
            $('.auto-planer-phase1-wrap').addClass('hidden');
            $('.auto-planer-phase2-wrap').removeClass('hidden');
            $('.week-dates').addClass('hidden');
        }

        function autoplanerPhaseThree(){

            // this function also takes care of gym trainings 
            assignIndividualTraining(trainingTypesArray);
            $('.auto-planer-phase2-wrap').addClass('hidden');
            $('.auto-planer-phase3-wrap').removeClass('hidden');
            $('.week-dates').removeClass('hidden');
            $('.workout-cell').removeClass('workout-cell-empty').removeClass('workout-cell-filled').removeClass('question-cell');
        }

        function countTrainingAndGymBlocks(){

            // this funtion is filling in the individualTrainingBlocks[] and gymBlocks[] array 
            //
            var workoutsTD = $('.workout-tr td');
            var cellDate, cellText, blockName, index, className;
            workoutsTD.each(function() {
                cellDate = $(this).attr("data-day");
                i = 0;
                
                $(this).children('.workout-cell').each(function() {
                    if (!$(this).hasClass("workout-cell-empty")) {
                        blockName = $(this).attr('data-block');
                        index = $(this).attr('data-index');
                        
                        //console.log('blockName', blockName);
                        if (blockName == "Trening-Indywidualny"){
                            individualTrainingBlocks.push([cellDate,index]);
                            blockDetails = "individual_"+cellDate+"_"+index;
                            $(this).attr('data-blockDetails', blockDetails);
                            $(this).attr('data-blocksArrayIndex', individualBlocksCount);
                            $(this).attr('data-type', 'individual');
                            individualBlocksCount++;
                        } 
                        if (blockName == "Siłownia"){
                            gymBlocks.push([cellDate,index]);
                            blockDetails = "gym_"+cellDate+"_"+index;
                            $(this).attr('data-blockDetails', blockDetails);
                            $(this).attr('data-blocksArrayIndex', gymBlocksCount);
                            $(this).attr('data-type', 'gym');
                            gymBlocksCount++;
                        }
                    }
                });
            });
            //console.log('individualTrainingBlocks',individualTrainingBlocks);
            //console.log('gymBlocks',gymBlocks);
        }

        function determineTraining(){
            // determine individual tranings 
            if ( individualTrainingBlocks.length != 0){
                for (var i = 0; i < individualTrainingBlocks.length ; i++) {
                    if (individualTrainingBlocks[i][2]){

                    } else {
                        //console.log('nie ustalony indywidualny');
                        var date = individualTrainingBlocks[i][0];
                        var index = individualTrainingBlocks[i][1];
                        generateQuestion ('individual', date, index, i); 
                        return;
                    }
                } 
            } 

            if ( gymBlocks.length != 0){
                for (var i = 0; i < gymBlocks.length ; i++) {
                    if (gymBlocks[i][2]){

                    } else {
                        //console.log('nie ustalony gym');
                        var date = gymBlocks[i][0];
                        var index = gymBlocks[i][1];
                        generateQuestion ('gym', date, index, i); 
                        return;
                    }
                } 
            } 
            autoplanerPhaseThree();
        }

        function assignIndividualTraining(typesArray){
            //console.log('making ajax call');

            //console.log('typesArray', typesArray);

            $.ajax({
                type: "post",
                url: "/wp-admin/admin-ajax.php",
                data: {
                    action: 'assignTrainings',
                    trainingTypes: typesArray
                },
                success: function(data) {
                    //console.log('sukcess!!');
                    //console.log(data);
                    
                    assignedIndividualTrainings = JSON.parse(data);
                    //console.log('assignedIndividualTrainings',assignedIndividualTrainings);

                    assignGymTrainingAndSaveSchedule(gymTypesArray);
                    
                },
                error: function(errorThrown) {
                    //console.log(errorThrown);
                }
            });
            /*
            if ( individualTrainingBlocks.length != 0){
                for (var i = 0; i < individualTrainingBlocks.length ; i++) {
                    if (individualTrainingBlocks[i][2]){
                        var trainingType = individualTrainingBlocks[i][2];

                    } else {
                        //console.log('nie ustalony indywidualny');
                    }
                } 
            } */
        }

        function assignGymTrainingAndSaveSchedule(typesArray){
            //console.log('making GYM AJAX call');

            //console.log('typesArray', typesArray);

            $.ajax({
                type: "post",
                url: "/wp-admin/admin-ajax.php",
                data: {
                    action: 'assignGymTrainings',
                    trainingTypes: typesArray
                },
                success: function(data) {
                    //console.log(data);
                    //console.log('gym sukcess!!');
                    assignedGymTrainings = JSON.parse(data)             
                    generateFinalSchedule(assignedIndividualTrainings, assignedGymTrainings);
                },
                error: function(errorThrown) {
                    //console.log(errorThrown);
                }
            });
            /*
            if ( individualTrainingBlocks.length != 0){
                for (var i = 0; i < individualTrainingBlocks.length ; i++) {
                    if (individualTrainingBlocks[i][2]){
                        var trainingType = individualTrainingBlocks[i][2];

                    } else {
                        //console.log('nie ustalony indywidualny');
                    }
                } 
            } */
        }

        function generateQuestion(type, date, index, arrayIndex){   
            $('.active-question').removeClass('active-question');
            $('.phase-2-next').removeAttr("data-answer");

            var dateText = moment(date).locale('pl').format('dddd D MMM');
            var blockDetails = type+'_'+date+'_'+index;
            //console.log('blockDetails',blockDetails);
                            
            if (type == 'individual'){
                var questionText = "Nad czym chcesz pracować podczas Mistrz Techniki w " + dateText + " ?";
                $('.auto-planer-individual-answers ').removeClass('hidden');
                $('.auto-planer-gym-answers').addClass('hidden');
            } else if (type == 'gym'){
                var questionText = "Nad czym chcesz pracować na Siłowni w " + dateText + " ?";
                $('.auto-planer-individual-answers ').addClass('hidden');
                $('.auto-planer-gym-answers').removeClass('hidden');
                
            }
            $('.auto-planer-phase-2-question').text(questionText);
            $('.phase-2-next').attr("data-questionArrayIndex",arrayIndex);
            $('.phase-2-next').attr("data-questionType",type);

            $('.workout-cell[data-blockDetails="'+blockDetails+'"]').addClass('active-question');
        }


        

