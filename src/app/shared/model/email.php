<?php
 
header('Content-type: application/json');
 
$errors = '';
 
if(empty($errors))
{
	$from_name = $_POST['name'];
	$from_email = $_POST['email'];
	$message = $_POST['message'];
 
	$to_email = 'steven.r.cooney@email.com';
	$to_email_cc = $from_email;
 
	$contact = "<p><strong>Name:</strong> $from_name</p>
		    <p><strong>Email:</strong> $from_email</p>";
	$content = "<p>$message</p>";
 
	$email_subject = "Neue Nachricht von $from_name erhalten";
	$email_subject_cc = "Deine Nachricht wurde gesendet";
 
	$email_body = '<html><body>';
	$email_body .= "$contact $content";
	$email_body .= '</body></html>';
 
	$headers .= "MIME-Version: 1.0\r\n";
	$headers .= "Content-Type: text/html; charset=ISO-8859-1\r\n";
	$headers .= "From: $my_email\n";
	$headers .= "Reply-To: $from_email";
 
	mail($to_email,$email_subject,$email_body,$headers);
	mail($to_email_cc,$email_subject_cc,$email_body,$headers);
 
	$response_array['status'] = 'success';
	echo json_encode($response_array);
} else {
	$response_array['status'] = 'error';
	echo json_encode($response_array);
}
?>