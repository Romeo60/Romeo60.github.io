<center>
	<div align="center" class="animated pulse slow" style="color: orange;"><h1><?=$GLOBALS["title"]?></h1></div>
<h1>Get in touch with us</h1>
<p>Go ahead and say hi, we sure would love hearing from you and we will make sure to reply as soon as possible</p>
<div class="col-xl-8 offset-xl-2 py-5">

	<form id="contact-form" method="post" role="form">
	<input class="form-control" type="text" name="name" placeholder="Full Name*"></br>
	<input class="form-control" type="email" name="email" placeholder="Email Adress*"></br>
	<input class="form-control" type="text" name="subject" placeholder="Subject"></br>
	<textarea class="form-control"  id="comment" name="message" placeholder="Message..." rows=5; cols="5"></textarea> </br>
	<button class="btn btn-success navbar-btn"  name="submit"type="submit">Send</button>
	<?error();?>
</form>
<p>Or</p>
<a href="callto:0658522045">Call Contact At Company</a>
</div>
</center>

<?
success();
if (isset($_POST["submit"])) {
	$to_mail = "romeo607080@gmail.com";
	$subject =$_POST["subject"];
 	$message = $_POST["message"];
 	$header = "From: ".$_POST["email"];
}
 

 if(mail($to_mail, $subject, $message, $header)){
 	echo ("svn_fs_dir_entries(fsroot, path)");
 }else{
 	echo ("error");
 }
 
?>
<script type="text/javascript">
	function error(){
		window.alert("Something went wrong, try again or callus");
	}
	function success(){
		window.alert("Thank you for contacting us, you'll hear from us soon");
	}
</script>
