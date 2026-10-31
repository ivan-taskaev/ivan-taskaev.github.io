# Иван Таскаев · Ivan Taskaev

PHP / Backend-разработчик · Symfony, Laravel. Резюме и кейсы проектов.
PHP / Backend Developer · Symfony, Laravel. Resume and case studies.

- **Резюме / Resume** — главная страница, RU/EN, PDF для скачивания
- **[Trezo](trezo/)** — маркетплейс объявлений: Symfony, PostgreSQL, Redis, Next.js, AWS
- **[Layer](layer/)** — магазин музыкальных сэмплов: Go, Python, React, PostgreSQL, S3

Язык выбирается по настройкам браузера; ссылка с `?lang=en` или `?lang=ru` открывает нужную версию.

## Как устроено

Обычный HTML и CSS без сборки, GitHub Pages публикует как есть.

```
index.html            резюме (оно же — источник PDF)
trezo/index.html      кейс Trezo
layer/index.html      кейс Layer
assets/css/style.css  стили и печатная вёрстка резюме в одну страницу A4
assets/js/site.js     переключение языка, YouTube-видео, заглушки скриншотов
assets/img/           скриншоты 1920×1080 (WebP)
assets/video/         демо-ролики (WebM)
assets/cv/            ivan-taskaev-cv-ru.pdf, ivan-taskaev-cv-en.pdf
```

Каждый текст записан дважды: `<span lang="ru">` и `<span lang="en">`.

## PDF

PDF печатаются из `index.html` стилями `@media print`, поэтому текст в PDF и на сайте всегда одинаковый.
После правки резюме откройте страницу в Chrome, выберите язык и сделайте «Печать → Сохранить как PDF»
(A4, поля по умолчанию, «Фоновая графика» включена), затем замените файл в `assets/cv/`.

## Локальный просмотр

```sh
python3 -m http.server 8000
```

и откройте <http://localhost:8000>.
