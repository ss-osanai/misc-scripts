async function downloadFile(url, filename) {
  const response = await fetch(url);
  const blob = await response.blob();
  const a = document.createElement('a');
  const urlObject = URL.createObjectURL(blob);
  a.href = urlObject;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(urlObject); // メモリを解放
}

// ファイルを逐次的にダウンロード
async function downloadAllFiles() {
  const downloadLinks = document.querySelectorAll('.download-link');

  for (const link of downloadLinks) {
    const url = link.href;
    const filename = link.getAttribute('download') || '';
    await downloadFile(url, filename); // 各ダウンロードが完了するまで待機
  }

  alert('すべてのダウンロードが完了しました。');
}

document.getElementById('downloadAll').addEventListener('click', function () {
  downloadAllFiles();
});
