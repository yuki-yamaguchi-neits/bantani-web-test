# Web担当者くん 動作確認ダミーサイト

本番の番谷石材店サイトを使わず、更新フローだけを先に検証するためのミニサイトです。

## 含まれるもの

- HTML: `public/index.html`
- CSS: `public/assets/css/style.css`
- JavaScript: `public/assets/js/app.js`
- 現在表示用WebP画像2枚
- 画像差し替え用JPEG 1枚: `drive_inbox_sample/replace-top-hero.jpg`
- 画像スロット定義: `config/IMAGE_SLOTS.json`
- サイト対応表: `config/SITE_MAP.md`

## 最初に試す変更

1. `test-message` の文章を「更新テスト成功」に変更する。
2. previewではGitHubを書き換えないことを確認する。
3. 「公開して」で1コミットだけ作られることを確認する。
4. `top-hero` を `replace-top-hero.jpg` に差し替え、WebP化されることを確認する。
5. 公開先で表示が変わることを確認する。
6. rollbackで1つ前へ戻ることを確認する。

## CSS / JavaScript確認

- CSSテスト: `--accent` を別の色へ変更するとラベル色が変わる。
- JSテスト: 「JavaScript動作確認」ボタンを押すと状態表示が切り替わる。

## 重要

これは動作確認専用です。本番ドメイン・本番GitHub・本番ロリポップには接続しないでください。
