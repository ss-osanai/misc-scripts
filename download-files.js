async function downloadFile(url, filename, listItem) {
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

        // ダウンロード完了後にフォントカラーを黒に変更
        listItem.style.color = "black";
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
    const downloadList = document.getElementById('downloadList');
    
    // ボタンを無効化してダウンロードが終わるまでクリックを防止
    downloadButton.disabled = true;

    // リストをクリアしてからファイル名を追加
    downloadList.innerHTML = '';
    const listItems = [];

    for (const link of downloadLinks) {
        const url = link.href;
        const filename = link.getAttribute('download') || url.split('/').pop();

        // ダウンロード予定のファイルをリストに表示（グレーのフォントで）
        const listItem = document.createElement('li');
        listItem.textContent = filename;
        listItem.style.color = "gray"; // 初期状態はグレー
        downloadList.appendChild(listItem);
        listItems.push(listItem);

        // ダウンロードし、完了したらカラーを変更
        await downloadFile(url, filename, listItem);
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
