(() => {
  const button = document.getElementById('testButton');
  const status = document.getElementById('jsStatus');
  if (!button || !status) return;

  button.addEventListener('click', () => {
    document.body.classList.toggle('js-ok');
    const active = document.body.classList.contains('js-ok');
    status.textContent = active
      ? 'JavaScript動作確認：OK'
      : 'JavaScriptはまだ操作されていません。';
    button.textContent = active
      ? '元に戻す'
      : 'JavaScript動作確認';
  });
})();
