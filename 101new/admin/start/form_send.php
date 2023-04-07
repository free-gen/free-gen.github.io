<?php 
if (empty($_POST)) {header('Location: /');}
$form_id = $_POST['form_id'];

if (!file_exists('form/'.$form_id.'.php')) {
	$html = '<div style="background-color:#fff;color:#000;font-weight:bold;font-size:15px;border:1px solid #eee;border-radius:8px;padding:10px 20px;margin-top:15px;margin-bottom:15px;">Уппс! Что-то пошло не так!!!</div>';
	echo json_encode(['result' => 'error', 'html' => $html]);
	return false;
}
$form = include('form/'.$form_id.'.php');
foreach ($_POST as $key => $value) {
	$form['message'] = str_replace('{{'.$key.'}}', $value, $form['message']);
}
// Отправляем письмо
$to      = $form['to_email'];
$subject = $form['subject'];
$message = $form['message'];
$headers = 'From: ' . $form['from_email'] . "\r\n" .
    // 'Reply-To: ' . $form['from_email'] . "\r\n" .
    'X-Mailer: PHP/' . phpversion();
$result = mail($to, $subject, $message, $headers);
if ($result) {
	$html = '<div style="background-color:#fff;color:#000;font-weight:bold;font-size:15px;border:1px solid #eee;border-radius:8px;padding:10px 20px;margin-top:15px;margin-bottom:15px;">Спасибо! Сообщение успешно отправлено!</div>';
	echo json_encode(['result' => 'ok', 'redirect' => $form['redirect'], 'data' => $form, 'html' => $html]);
} else {
	$html = '<div style="background-color:#fff;color:#000;font-weight:bold;font-size:15px;border:1px solid #eee;border-radius:8px;padding:10px 20px;margin-top:15px;margin-bottom:15px;">Упс! Письмо почему-то не было отправлено!</div>';
	echo json_encode(['result' => 'error', 'html' => $html]);
}

return false;
?>
