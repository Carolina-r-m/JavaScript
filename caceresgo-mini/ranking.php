<?php
/**
 * Este archivo muestra el ranking de jugadores ordenado por puntos.
 * Sin parámetros enseña una tabla y con ?formato=json devuelve los datos en JSON.
 *
 * Para probarlo: php -S localhost:8000 y abrir http://localhost:8000/ranking.php
 */

// De momento uso estos datos de prueba. Más adelante podrían venir de MySQL.
$jugadores = [
    ["nombre" => "Lucía",    "puntos" => 45],
    ["nombre" => "Carolina", "puntos" => 60],
    ["nombre" => "Pablo",    "puntos" => 30],
];

/** Ordeno los jugadores de mayor a menor puntuación. */
function ordenarRanking(array $jugadores): array {
    usort($jugadores, fn($a, $b) => $b["puntos"] <=> $a["puntos"]);
    return $jugadores;
}

/**
 * Esta sería la versión usando MySQL y PDO.
 * La dejo comentada porque ahora mismo no tengo una base de datos conectada.
 */
// function ranking_desde_bd(PDO $pdo): array {
//     $sql = "SELECT nombre, puntos FROM usuarios ORDER BY puntos DESC LIMIT :limite";
//     $stmt = $pdo->prepare($sql);
//     $stmt->bindValue(":limite", 10, PDO::PARAM_INT);
//     $stmt->execute();
//     return $stmt->fetchAll(PDO::FETCH_ASSOC);
// }

$ranking = ordenarRanking($jugadores);

// Si se pide JSON, devuelvo los datos y termino el archivo
if (($_GET["formato"] ?? "") === "json") {
    header("Content-Type: application/json; charset=utf-8");
    echo json_encode($ranking, JSON_UNESCAPED_UNICODE);
    exit;
}
?>
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Ranking CaceresGo</title>
</head>
<body>
  <h1>🏆 Ranking</h1>
  <table border="1" cellpadding="6">
    <tr><th>#</th><th>Jugador</th><th>Puntos</th></tr>
    <?php foreach ($ranking as $i => $j): ?>
      <tr>
        <td><?= $i + 1 ?></td>
        <!-- htmlspecialchars protege el nombre antes de mostrarlo -->
        <td><?= htmlspecialchars($j["nombre"]) ?></td>
        <td><?= (int)$j["puntos"] ?></td>
      </tr>
    <?php endforeach; ?>
  </table>
</body>
</html>
