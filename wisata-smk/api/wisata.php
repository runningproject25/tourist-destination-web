<?php
// api/wisata.php — CRUD + filter populer
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit(); }

$conn = new mysqli('localhost','root','','db_dispopar');
if ($conn->connect_error) { echo json_encode(['sukses'=>false,'pesan'=>$conn->connect_error]); exit(); }
$conn->set_charset('utf8mb4');

$method = $_SERVER['REQUEST_METHOD'];
$id     = isset($_GET['id'])     ? (int)$_GET['id']  : null;
$mode   = isset($_GET['mode'])   ? $_GET['mode']      : 'semua'; // 'populer' atau 'semua'

switch ($method) {
    case 'GET':    $id ? ambilSatu($conn,$id) : ambilSemua($conn,$mode); break;
    case 'POST':   tambah($conn);       break;
    case 'PUT':    edit($conn,$id);     break;
    case 'DELETE': hapus($conn,$id);    break;
    default: echo json_encode(['sukses'=>false,'pesan'=>'Metode tidak dikenal']);
}
$conn->close();

// GET semua | GET ?mode=populer
function ambilSemua($conn, $mode) {
    $where = "WHERE aktif = 1";
    if ($mode === 'populer') $where .= " AND populer = 1";

    $cari = isset($_GET['q']) ? '%'.$conn->real_escape_string($_GET['q']).'%' : null;
    if ($cari) $where .= " AND (objek_wisata LIKE '$cari' OR lokasi LIKE '$cari' OR kategori LIKE '$cari')";

    $sql  = "SELECT id,objek_wisata,lokasi,link_maps,kategori,deskripsi,fasilitas,
                    jarak,pengelola,gambar,suara_tipe,
                    video_id,video_tipe,video_dur,urutan,populer,aktif
             FROM wisata $where ORDER BY urutan ASC, created_at DESC";

    $result = $conn->query($sql);
    $data   = [];
    while ($row = $result->fetch_assoc()) {
        $row['fasilitas'] = json_decode($row['fasilitas'] ?? '[]', true);
        $data[] = $row;
    }
    echo json_encode(['sukses'=>true,'jumlah'=>count($data),'data'=>$data]);
}

// GET ?id=1
function ambilSatu($conn,$id) {
    $stmt = $conn->prepare("SELECT * FROM wisata WHERE id=?");
    $stmt->bind_param('i',$id); $stmt->execute();
    $row  = $stmt->get_result()->fetch_assoc();
    if (!$row) { echo json_encode(['sukses'=>false,'pesan'=>'Tidak ditemukan']); return; }
    $row['fasilitas'] = json_decode($row['fasilitas']??'[]',true);
    echo json_encode(['sukses'=>true,'data'=>$row]);
    $stmt->close();
}

// POST
function tambah($conn) {
    $d = json_decode(file_get_contents('php://input'),true);
    if (empty($d['objek_wisata'])) { echo json_encode(['sukses'=>false,'pesan'=>'Nama Objek Wisata wajib']); return; }
    $f = json_encode($d['fasilitas']??[]);
    $u = (int)($d['urutan']??0); $p = (int)($d['populer']??0); $a = (int)($d['aktif']??1);
    $stmt = $conn->prepare("INSERT INTO wisata (objek_wisata,lokasi,link_maps, kategori,deskripsi,fasilitas,jarak,pengelola,gambar,suara_tipe,video_id,video_tipe,video_dur,urutan,populer,aktif) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)");
    $stmt->bind_param('sssssssssssssssii',
        $d['objek_wisata'],$d['lokasi'],$d['link_maps'],$d['kategori'],
        $d['deskripsi'],$f,$d['jarak'],$d['pengelola'],
        $d['gambar'],$d['suara_tipe'],
        $d['video_id'],$d['video_tipe'],$d['video_dur'],$u,$p,$a);
    echo $stmt->execute()
        ? json_encode(['sukses'=>true,'pesan'=>'Berhasil ditambah','id'=>$conn->insert_id])
        : json_encode(['sukses'=>false,'pesan'=>$stmt->error]);
    $stmt->close();
}

// PUT ?id=1
function edit($conn,$id) {
    if (!$id) { echo json_encode(['sukses'=>false,'pesan'=>'ID diperlukan']); return; }
    $d = json_decode(file_get_contents('php://input'),true);
    $f = json_encode($d['fasilitas']??[]);
    $u = (int)($d['urutan']??0); $p = (int)($d['populer']??0); $a = (int)($d['aktif']??1);
    $stmt = $conn->prepare("UPDATE wisata SET objek_wisata=?,lokasi=?,link_maps=?,kategori=?,deskripsi=?,fasilitas=?,jarak=?,pengelola=?,gambar=?,suara_tipe=?,video_id=?,video_tipe=?,video_dur=?,urutan=?,populer=?,aktif=? WHERE id=?");
    $stmt->bind_param('ssssssssssssssiii' . 'i',   // 14s + 3i + 1i (id)
        $d['objek_wisata'],$d['lokasi'],$d['link_maps'],$d['kategori'],
        $d['deskripsi'],$f,$d['jarak'],$d['pengelola'],
        $d['gambar'],$d['suara_tipe'],
        $d['video_id'],$d['video_tipe'],$d['video_dur'],$u,$p,$a,$id);
    echo $stmt->execute()
        ? json_encode(['sukses'=>true,'pesan'=>'Berhasil diupdate'])
        : json_encode(['sukses'=>false,'pesan'=>$stmt->error]);
    $stmt->close();
}

// DELETE ?id=1
function hapus($conn,$id) {
    if (!$id) { echo json_encode(['sukses'=>false,'pesan'=>'ID diperlukan']); return; }
    $stmt = $conn->prepare("DELETE FROM wisata WHERE id=?");
    $stmt->bind_param('i',$id);
    echo $stmt->execute()
        ? json_encode(['sukses'=>true,'pesan'=>'Berhasil dihapus'])
        : json_encode(['sukses'=>false,'pesan'=>$stmt->error]);
    $stmt->close();
}
