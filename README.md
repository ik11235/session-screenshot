# session-screenshot

ログインが必要なページの全体スクリーンショットを取るだけのscript

## HOW TO USE

### setup

```bash
npm i
```

- `cookie.txt` にkey=value方式で使用したいcookieを記述(複数行指定可)

```
sessionid=aaabbbccc
fp=xxyyzz
```

- `target_url_list.txt` に保存したいURLの一覧を記載

```
https://www.yahoo.co.jp
https://google.com
https://note.com/info/n/nea1b96233fbf
https://qiita.com/Qiita/items/c686397e4a0f4f11683d
```

### exec

```
node index.js
```

それぞれのスクリーンショットが、screenshotディレクトリに出力されます
