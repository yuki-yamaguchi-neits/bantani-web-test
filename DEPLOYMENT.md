# 検証環境の公開手順

このリポジトリは Cloudflare Workers + Static Assets 用です。公開前に Cloudflare の Worker Secret として次の2つを設定します。

```text
BASIC_AUTH_USERNAME
BASIC_AUTH_PASSWORD
```

値はGitへ保存しません。ローカル検証だけでは `.dev.vars` を作成し、同じ2変数を設定してください。`.dev.vars` は `.gitignore` 対象です。

Cloudflare DashboardでGitHubリポジトリをWorkers Buildsへ接続し、production branchを指定すると、以後のpushでworkers.dev URLへ自動デプロイされます。

`X-Robots-Tag`、`robots.txt`、`Cache-Control: no-store` はWorkerが全レスポンスへ付与します。
