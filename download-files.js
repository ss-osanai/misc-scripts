async function downloadFile(url, filename) {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Failed to download: ${url}`);
        
        const blob = await response.blob();
        const a = document.createElement('a');
        const urlObject = URL.createObjectURL(blob);
        a.href = urlObject;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(urlObject); // メモリを解放
    } catch (error) {
        console.error(error);
        alert(`Error downloading file: ${filename}`);
    }
}

// ファイルを逐次的にダウンロード
async function downloadAllFiles() {
    // ダウンロード対象のリンクを取得
    const downloadLinks = document.querySelectorAll('.download-link');
    const downloadButton = document.getElementById('downloadAll');
    
    // ボタンを無効化してダウンロードが終わるまでクリックを防止
    downloadButton.disabled = true;

    for (const link of downloadLinks) {
        const url = link.href;
        // download 属性が設定されていない場合は URL からファイル名を取得
        const filename = link.getAttribute('download') || url.split('/').pop();
        await downloadFile(url, filename); // 各ダウンロードが完了するまで待機
    }

    alert('すべてのダウンロードが完了しました。');
    
    // ダウンロードが完了したらボタンを再度有効化
    downloadButton.disabled = false;
}

// 一度だけイベントリスナーを登録
document.addEventListener('DOMContentLoaded', function () {
    const downloadButton = document.getElementById('downloadAll');
    if (downloadButton) {
        downloadButton.addEventListener('click', function () {
            downloadAllFiles();
        }, { once: true }); // ボタンを一度だけ実行
    }
});
