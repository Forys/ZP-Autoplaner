<?php
/*
Template Name:Automatuczny Planer Treningu
*/
get_header('autoplaner'); 

$user_id = get_current_user_id( );
$autoPlanerVisited = get_user_meta( $user_id, 'autoPlanerWelcome');

if ($autoPlanerVisited){
	$hidePrewrapClass = 'hidden';
	$hidePhase1WrapClass = '';
} else {
	$hidePrewrapClass = '';
	$hidePhase1WrapClass = 'not-visible';
}
?>


<div class="container auto-planer-container pad-bot" style="padding-top: 2em;">
	<div class="auto-planer-pre-wrap <?php echo $hidePrewrapClass; ?> col-lg-8 col-md-8 col-sm-12 col-xs-12 margin-auto pad-top">	

		<?php global $current_user;
     		 get_currentuserinfo(); ?>
		<h4 class="text-center" style="margin-bottom: 1.6em;">Witaj <?php echo $current_user->user_firstname; ?>!</h4>
		<p class="text-center"><strong>Zanim zaczniesz:<br><br></strong>Odpowiedz na kilka prostych pytań naszego <strong>Wirtualnego Trenera</strong>,<br> a on ułoży Ci trening dopasowany do Twoich potrzeb!</p>

		<button class="auto-planer-pre-btn text-center btn-large btn btn-primary" >Dalej <i class="fa fa-angle-double-right"></i></button>
		<div class="clr"></div>
	</div>

	<div class="auto-planer-phase1-wrap <?php echo $hidePhase1WrapClass; ?> col-lg-8 col-md-8 col-sm-12 col-xs-12 margin-auto">	
		<h4 class="auto-planer-question"></h4>
	   
	    <div class="auto-planer-days-wrap ">
		    
		    	<div class="flex-wrap-center">
			    	<button class="btn btn-primary btn-primary-invert auto-planer-day-btn auto-planer-day-btn-inactive auto-planer-day-btn-1"></button>
			    	<button class="btn btn-primary btn-primary-invert auto-planer-day-btn auto-planer-day-btn-inactive auto-planer-day-btn-2"></button>
			    	<button class="btn btn-primary btn-primary-invert auto-planer-day-btn auto-planer-day-btn-inactive auto-planer-day-btn-3"></button>
			    	<button class="btn btn-primary btn-primary-invert auto-planer-day-btn auto-planer-day-btn-inactive auto-planer-day-btn-4"></button>
			    	<button class="btn btn-primary btn-primary-invert auto-planer-day-btn auto-planer-day-btn-inactive auto-planer-day-btn-5"></button>
			    	<button class="btn btn-primary btn-primary-invert auto-planer-day-btn auto-planer-day-btn-inactive auto-planer-day-btn-6"></button>
			    	<button class="btn btn-primary btn-primary-invert auto-planer-day-btn auto-planer-day-btn-inactive auto-planer-day-btn-7"></button>	
			    </div>

		    
		</div>

		<div class="">
			<button class="auto-planer-back-btn btn-large btn btn-primary"><i class="fa fa-angle-double-left"></i> Wstecz</button>
			<button class="auto-planer-next btn-large btn btn-primary">Dalej <i class="fa fa-angle-double-right"></i></button>
			<hr style="width: 100%; ">
		</div>

		<div class="clr"></div>
	</div>

	<div class="auto-planer-phase3-wrap hidden col-lg-8 col-md-8 col-sm-12 col-xs-12 margin-auto ">
		<div class="">
			<h4 class="text-center">Twój plan trening jest gotowy!</h4>

			<?php if(is_user_logged_in()){ ?>
				<p class="text-center">Kliknij w guzik poniżej i zobacz co dla Ciebie przygotowaliśmy!</p>
				<a href="/planer/"><button class="btn-primary btn btn-large" style="margin: 25px auto; display: block;">Mój Planer</button></a>
			<?php }else { ?>
				<p class="text-center" style="">Aby kontynuować, <strong>zaloguj</strong> się lub <strong>załóż konto</strong> i zobacz co dla Ciebie przygotowaliśmy!</p>
				

				<div class="register-wrap mx-3">

					<a href="/logowanie/"><button class="btn-primary btn btn-large" style="margin: 25px auto; display: block; width: 100%;">Zaloguj się</button></a>

					<p class="divider-text">
				        <span class="bg-white">LUB</span>
				    </p>
					<p>	
						<a href="https://zostacpilkarzem.pl/wp-login.php?loginSocial=facebook" data-plugin="nsl" data-action="connect" data-redirect="https://zostacpilkarzem.pl/dziekujemy/" data-provider="facebook" data-popupwidth="475" data-popupheight="175" class="btn btn-block btn-facebook">
							<i class="fa fab fa-facebook" style="margin-right: 10px;"></i> <span style="font-weight: 400;"> Zarejestruj się przez <b>Facebooka</b></span>
						</a>
					</p>
					<p class="divider-text">
				        <span class="bg-white">LUB</span>
				    </p>
				    	<p>Zarejestruj się przez email:</p>
						<form id="register-form" >
						<div class="form-group input-group">
							<div class="input-group-prepend">
							    <span class="input-group-text"> <i class="fa fa-user"></i> </span>
							 </div>
					        <input name="login" class="form-control" placeholder="Nazwa użytkownika" type="text" id="login">
					    </div> <!-- form-group// -->
					    <div class="form-group input-group">
					    	<div class="input-group-prepend">
							    <span class="input-group-text"> <i class="fa fa-envelope"></i> </span>
							 </div>
					        <input name="email" class="form-control" placeholder="Adres email" type="email" id="email">
					    </div> <!-- form-group// -->
					    
					    <div class="form-group input-group">
					    	<div class="input-group-prepend">
							    <span class="input-group-text"> <i class="fa fa-lock"></i> </span>
							</div>
					        <input name="password" class="form-control" placeholder="Hasło" type="password" id="password">
					    </div> <!-- form-group// -->    
					    <div class="mb-3">	
					    	<input name="privacy"  type="checkbox" id="privacy"> 
					    	<label for="privacy" style=" margin-left: 19px; font-size: 16px;font-weight: 600;margin-top: -17px;line-height: 21px;" >Wyrażam zgodę na przetwarzanie moich danych osobowych w celu założenia konta na platformie Zostać Piłkarzem. <a href="https://zostacpilkarzem.pl/polityka-prywatnosci/" style="color: #00ac62;">Polityka Prywatności</a> </label>
					    </div> 
					    <div class="form-group">
					        <input type="submit" class="btn btn-primary btn-block btn-large" style="margin-bottom: 20px;margin-top: 20px;" value="Zarejestruj się" id="register-button">  
					    </div> <!-- form-group// -->  


						   
						</form>  
						
						<h4 id="register-text" class="text-center hidden">Ładowanie...</h4>  
			     </div>


				    
			<?php } ?>
			<hr style="width: 100%; ">
		</div>
		<div class="clr"></div>
	</div>


	<div class="week-preview-container <?php echo $hidePhase1WrapClass; ?> col-lg-8 col-md-8 col-sm-12 col-xs-12 margin-auto">

		<div class="week-dates">
			<p >Tygodniowy trening na: <br> <strong><span class="week-start"></span></strong> - <strong><span class="week-end"></span></strong></p>
			<div class="auto-planer-question-thumbnail"></div>
		</div>
		<table class="schedule-table">
		   <tr class="days-tr">	 
			<td class="day"><span class="day-text"></span><span class="day-number"></span></td>
		    <td class="day"><span class="day-text"></span><span class="day-number"></span></td>
		    <td class="day"><span class="day-text"></span><span class="day-number"></span></td>
		    <td class="day"><span class="day-text"></span><span class="day-number"></span></td>
		    <td class="day"><span class="day-text"></span><span class="day-number"></span></td>
		    <td class="day"><span class="day-text"></span><span class="day-number"></span></td>
		    <td class="day"><span class="day-text"></span><span class="day-number" style="border-right: 1px solid #efefef;"></span></td>
		  </tr>
		  <tr class="workout-tr">
		    
		    <td class="workout-day-column workout-day-1-column">
		    	<div class="workout-cell workout-cell-empty workout-cell-first block-match-bg" data-index="0"></div>
		    	<div class="workout-cell workout-cell-empty workout-cell-center" data-index="1"></div>
		    	<div class="workout-cell workout-cell-empty workout-cell-last" data-index="2"></div>
		    </td>
		   	<td class="workout-day-column workout-day-2-column">
		   		<div class="workout-cell workout-cell-empty workout-cell-first" data-index="0"></div>
		    	<div class="workout-cell workout-cell-empty workout-cell-center" data-index="1"></div>
		    	<div class="workout-cell workout-cell-empty workout-cell-last" data-index="2"></div>
		   	</td>
		   	<td class="workout-day-column workout-day-3-column">
		   		<div class="workout-cell workout-cell-empty workout-cell-first" data-index="0"></div>
		    	<div class="workout-cell workout-cell-empty workout-cell-center" data-index="1"></div>
		    	<div class="workout-cell workout-cell-empty workout-cell-last" data-index="2"></div>
		   	</td>
		   	<td class="workout-day-column workout-day-4-column">
		   		<div class="workout-cell workout-cell-empty workout-cell-first" data-index="0"></div>
		    	<div class="workout-cell workout-cell-empty workout-cell-center" data-index="1"></div>
		    	<div class="workout-cell workout-cell-empty workout-cell-last" data-index="2"></div>
		   	</td>
		   	<td class="workout-day-column workout-day-5-column">
		   		<div class="workout-cell workout-cell-empty workout-cell-first" data-index="0"></div>
		    	<div class="workout-cell workout-cell-empty workout-cell-center" data-index="1"></div>
		    	<div class="workout-cell workout-cell-empty workout-cell-last" data-index="2"></div>
		   	</td>
		   	<td class="workout-day-column workout-day-6-column">
		   		<div class="workout-cell workout-cell-empty workout-cell-first" data-index="0" ></div>
		    	<div class="workout-cell workout-cell-empty workout-cell-center" data-index="1"></div>
		    	<div class="workout-cell workout-cell-empty workout-cell-last" data-index="2"></div>
		   	</td>
		   	<td class="workout-day-column workout-day-7-column">
		   		<div class="workout-cell workout-cell-empty workout-cell-first"  data-index="0" style="border-right: 1px solid #efefef;"></div>
		    	<div class="workout-cell workout-cell-empty workout-cell-center" data-index="1" style="border-right: 1px solid #efefef;"></div>
		    	<div class="workout-cell workout-cell-empty workout-cell-last" data-index="2" style="border-right: 1px solid #efefef;"></div>
		   	</td>
		  </tr>		
		</table>
		<div class="clr"></div>
	</div>

	<div class="auto-planer-phase2-wrap hidden col-lg-8 col-md-8 col-sm-12 col-xs-12 margin-auto">
		<div class=" ">

			<!--<hr style="width: 100%; ">-->
			<h4 class="auto-planer-phase-2-question"></h4>

			<div class="auto-planer-individual-answers hidden">
				<button class="individual-answer-btn btn btn-primary btn-primary-invert" data-trainingSlug="ball-mastery">Ball Mastery</button>
				<button class="individual-answer-btn btn btn-primary btn-primary-invert" data-trainingSlug="drybling">Drybling</button>
				<button class="individual-answer-btn btn btn-primary btn-primary-invert" data-trainingSlug="podania">Podania</button>
				<button class="individual-answer-btn btn btn-primary btn-primary-invert" data-trainingSlug="technika-ze-sciana">Technika ze ścianą</button>
			</div>

			<div class="auto-planer-gym-answers hidden">
				<button class="individual-answer-btn btn btn-primary btn-primary-invert" data-trainingSlug="rece">Ręce</button>
				<button class="individual-answer-btn btn btn-primary btn-primary-invert" data-trainingSlug="nogi">Nogi</button>
				<button class="individual-answer-btn btn btn-primary btn-primary-invert" data-trainingSlug="klatka-piersiowa">Klatka Piersiowa</button>
				<button class="individual-answer-btn btn btn-primary btn-primary-invert" data-trainingSlug="brzuch">Brzuch</button>
				<button class="individual-answer-btn btn btn-primary btn-primary-invert" data-trainingSlug="cale-cialo">Całe Ciało</button>
			</div>

			<div class="  hidden">

				<button class="phase-2-back btn-large btn btn-primary"><i class="fa fa-angle-double-left"></i> Wstecz</button>
				<button class="phase-2-next btn-large btn btn-primary">Dalej <i class="fa fa-angle-double-right"></i></button>
				
			</div>

		</div>
	</div>
	<div class="clr"></div>



</div>

