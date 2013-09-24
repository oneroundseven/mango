
<?php

$con = mysqli_connect('localhost', 'root', '123456', 'demo');

if (mysqli_connect_errno()) {

    printf('Could not connect: %s\n', mysqli_connect_error());

    exit();

}


$arg = $_GET['table'];
$query = "SELECT * FROM mytable"; // $query = "SELECT * FROM ". $arg; //
$result = mysqli_query($con, $query);
$out = array();

while ($row = mysqli_fetch_array($result)) {
    array_push($out, array('firstname' => $row['first_name'], 'lastname' => $row['last_name']));
}

echo json_encode($out);
?>