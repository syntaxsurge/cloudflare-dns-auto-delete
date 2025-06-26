// ────────────────────────────────────────────────────────────────────────────────
//  Delete ALL DNS records in the Cloudflare dashboard (any account / zone)
//  Supports BOTH UIs:
//    • “inline Delete” link that lives in each row (newer UI)
//    • legacy “Edit → Delete → Confirm” flow (older UI)
//  By SyntaxSurge / Jade Laurence Empleo
// ────────────────────────────────────────────────────────────────────────────────
if (location.hostname === 'dash.cloudflare.com') {
  /* ──────────────── Tunables and XPath helpers ──────────────── */
  const XPATH = {
    rows:                "//tr[@data-testid='dns-table-row']",
    deleteInline:        ".//a[@role='button']//span[normalize-space() = 'Delete']",
    editBtn:             ".//button[@data-testid='dns-table-row-edit-link']",
    deleteInExpanded:    "//button[@data-testid='dns-record-form-delete-button']",
    confirmDeleteGlobal: "//div//button//span[normalize-space() = 'Delete']"
  };

  /** Wait until an XPath matches an element, or time-out.
   *  @param {string}  xp        XPath to evaluate
   *  @param {Node}    root      Search scope (defaults to document)
   *  @param {number}  timeout   Max wait in ms (defaults 3 000)
   *  @returns {Promise<Node?>}  Resolves with the node (or null on timeout) */
  function waitForXPath(xp, root = document, timeout = 3_000) {
    return new Promise((resolve) => {
      const start = performance.now();
      const tick  = () => {
        const node = document.evaluate(
          xp, root, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null
        ).singleNodeValue;
        if (node) return resolve(node);
        if (performance.now() - start >= timeout) return resolve(null);
        requestAnimationFrame(tick);
      };
      tick();
    });
  }

  /* ──────────────── Main deletion routine ──────────────── */
  async function deleteDnsRecords() {
    const rowsSnapshot = document.evaluate(
      XPATH.rows, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null
    );

    for (let i = 0; i < rowsSnapshot.snapshotLength; i++) {
      const row = rowsSnapshot.snapshotItem(i);

      /* 1️⃣ Try the inline Delete link */
      const inlineDel = document.evaluate(
        XPATH.deleteInline, row, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null
      ).singleNodeValue;
      if (inlineDel) {
        inlineDel.click();
        await confirmAndWait();
        continue;
      }

      /* 2️⃣ Fallback: Edit → Delete → Confirm */
      const editButton = document.evaluate(
        XPATH.editBtn, row, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null
      ).singleNodeValue;
      if (!editButton) {
        console.log('⏭️  No Edit/Delete controls in this row - skipped');
        continue;
      }

      editButton.click();

      const expandedDel = await waitForXPath(XPATH.deleteInExpanded, document);
      if (!expandedDel) {
        console.log('⏭️  Delete button in expanded row not found - skipped');
        continue;
      }

      expandedDel.click();
      await confirmAndWait();
    }

    alert('✅  All visible records processed!');
  }

  /** Click the global confirm-delete button (if any) and wait a tick. */
  async function confirmAndWait() {
    const confirmBtn = await waitForXPath(XPATH.confirmDeleteGlobal, document, 2_000);
    if (confirmBtn) confirmBtn.click();
    await new Promise((r) => setTimeout(r, 800)); // allow DOM to settle
  }

  /* ──────────────── UI: “Delete All DNS Records” button ──────────────── */
  function injectActionButton() {
    const table = document.querySelector('main table');
    if (!table) return requestAnimationFrame(injectActionButton); // retry soon

    const btn = document.createElement('button');
    btn.textContent = 'Delete All DNS Records';
    Object.assign(btn.style, {
      background:  'linear-gradient(90deg,#343a40,#495057)',
      color:       '#fff',
      border:      'none',
      borderRadius:'8px',
      padding:     '10px 20px',
      marginBottom:'15px',
      cursor:      'pointer',
      fontSize:    '16px',
      fontFamily:  'Arial, sans-serif',
      fontWeight:  '600',
      letterSpacing:'0.7px',
      transition:  'all .3s ease',
      boxShadow:   '0 10px 20px rgba(0,0,0,.1)'
    });
    btn.addEventListener('mouseover', () => {
      btn.style.background = 'linear-gradient(90deg,#495057,#343a40)';
      btn.style.boxShadow  = '0 8px 16px rgba(0,0,0,.15)';
    });
    btn.addEventListener('mouseout', () => {
      btn.style.background = 'linear-gradient(90deg,#343a40,#495057)';
      btn.style.boxShadow  = '0 10px 20px rgba(0,0,0,.1)';
    });
    btn.addEventListener('mousedown', () => (btn.style.transform = 'translateY(2px)'));
    btn.addEventListener('mouseup',   () => (btn.style.transform = 'translateY(0)'));
    btn.addEventListener('click', deleteDnsRecords);

    table.parentElement.insertBefore(btn, table);
    console.log('🚀  “Delete All DNS Records” button injected');
  }

  injectActionButton();
}
