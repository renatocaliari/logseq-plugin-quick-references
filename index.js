import '@logseq/libs';

const quickReferenceRegEx = /^^(\#*? ?)Quick References(\\n)?/;

async function insertQuickReference(e, idxReference) {
  let foundBlockQuickReference = false;
  let foundReference = false;
  let pageContentsBlocks = await logseq.Editor.getPageBlocksTree('Contents');
  let quickReference = '';

  console.log('pageContentsBlocks:', pageContentsBlocks);
  let blockQuickReference = pageContentsBlocks.find((b) => quickReferenceRegEx.test(b.content));

  if (blockQuickReference) {
    foundBlockQuickReference = true;
    for (const [idx, children] of blockQuickReference.children.entries()) {
      if (idxReference === idx + 1) {
        quickReference = children.content;
        foundReference = true;
        logseq.Editor.insertAtEditingCursor(quickReference);
        break;
      }
    }
  }

  if (!foundBlockQuickReference) {
    logseq.App.showMsg(
      "The parent block 'Quick References' wasn't found on Contents page",
      'warning'
    );

    logseq.Editor.insertAtEditingCursor("😔");
  } else if (!foundReference) {
    logseq.App.showMsg(
      "The reference " + idxReference + " was not found under parent block 'Quick References'",
      'warning'
    );

    logseq.Editor.insertAtEditingCursor("😔");
  }

}

const main = async () => {
  for (const idx of [1, 2, 3, 4, 5, 6, 7, 8, 9]) {
    logseq.Editor.registerSlashCommand(('q' + (idx) + ' : Quick Reference ' + (idx)), async (e) => {
      insertQuickReference(e, idx)
    });
  }
}

logseq.ready(main).catch(console.error);
