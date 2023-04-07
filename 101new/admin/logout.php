<?
session_start();
unset($_SESSION['pagedot-auth']);
unset($_SESSION['pagedot-login']);
header('Location: index.php ');
?>