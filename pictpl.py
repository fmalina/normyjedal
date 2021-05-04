import glob

glob.glob('pic/*')


def render(title, img_src, desc):
    return f"""
<!doctype html>
<html lang="sk">
<head>
    <meta charset="utf8">
    <base href="/nom/">
    <link rel="stylesheet" href="style.css">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>{title}</title>
</head>
<body>
<main>
    <img src="{img_src}.jpg">
    {desc}
</main>
</body>
"""
