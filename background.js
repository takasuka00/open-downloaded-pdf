const {createFunc, changeFunc} = (() => {

    /**  @type {DownloadItem|null}  */
    let downloadItem = null;
    /**  @param {DownloadItem} item */
    const createFunc = (item) => {
        downloadItem = item;
    }

    /** @type {DownloadDelta} */
    let preDelta = null;
    /**  @param {DownloadDelta} delta */
    const changeFunc = (delta) => {
        if (!downloadItem.finalUrl.includes(".pdf") //ダウンロード元がpdfを表示しているページのダウンロードボタンではなく
            && delta.id === downloadItem.id //ダウンロードIDが同じで
            && preDelta && preDelta.filename && preDelta.filename.current.endsWith(".pdf") //pdfをダウンロードしていた場合
            && delta.state && delta.state.current === "complete" //ダウンロード完了時に
        ) {
            // 新しいタブでPDFを表示
            chrome.tabs.create({url: preDelta.filename.current});
        }

        preDelta = delta;
        if (delta.endTime) {
            preDelta = null
        }
    }

    return {createFunc, changeFunc};
})()

chrome.downloads.onCreated.addListener(createFunc);
chrome.downloads.onChanged.addListener(changeFunc);