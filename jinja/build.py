import os
import re
from dataclasses import dataclass
from typing import List

import mistletoe.contrib.mathjax
from jinja2 import Template

months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November',
          'December']


@dataclass
class Article:
    title: str
    date: str
    html: str


def parse_date(date: str):
    date_match = re.match(r"(\d{4})-(\d{2})-(\d{2})", date)
    return f"{int(date_match.group(3))} {months[int(date_match.group(2)) - 1]} {date_match.group(1)}"


def get_markdown_metadata(key: str, markdown_text: str):
    return re.match(fr"^-+(?:\n|.)*{key}:\s*(.+)(?:\n|.)*---", markdown_text).group(1)


def get_attributes(files: List[str]):
    articles: List[Article] = []
    for i in files:
        with open(f'e/blog/articles/md/{i}', 'r') as markdown_file:
            text = markdown_file.read()
            article = Article(get_markdown_metadata('title', text), parse_date(get_markdown_metadata('date', text)),
                              f'articles/{i.replace(".md", ".html")}')
            articles.append(article)
    return articles


def find_definition_list(text: str):
    lines = text.split('\n')

    for e in lines:
        if not e.startswith(': '):
            continue
        erroneous_ending = re.match(r'(?<!\\)[<>].+?(?<!\\)[<>]$', e)
        replaced_string = ''
        definitions = []
        start = re.match(r'(?<!\\)([^<>\n]*[^<>]*)$', lines[lines.index(e) - 1])
        if start is None:
            continue
        if start.group(1).endswith(':'):
            continue
        if start.group(1).startswith(': '):
            continue
        title = start.group(1) + '\n'
        replaced_string += title
        new_e = e.replace(erroneous_ending.group(0), '') if erroneous_ending else e
        replaced_string += new_e + '\n'
        definitions.append(new_e.replace(': ', ''))
        for o in range(lines.index(e) + 1, len(lines)):
            if not lines[o].startswith(': '):
                break

            erroneous_ending = re.match(r'(?<!\\)[<>].+?(?<!\\)[<>]$', e)
            new_o = lines[0].replace(erroneous_ending.group(0), '') if erroneous_ending else lines[o]
            definitions.append(new_o.replace(': ', ''))
            replaced_string += lines[o] + '\n'
        replaced_string = replaced_string.removesuffix('\n')
        replacement_string = f'<dl><dt>{title.strip()}</dt>'
        for i in definitions:
            replacement_string += f'<dd>{i}</dd>'
        replacement_string += '</dl>'
        text = text.replace(replaced_string, replacement_string)
    return text


def render_markdown(files: List[str], articles):
    for i in files:
        with open(f'e/blog/articles/md/{i}', 'r') as markdown_file:
            html_filename = i.replace('.md', '.html')
            text = markdown_file.read()
            text = re.sub(r"^---(?:\n|.)*?---", '', text)
            if os.path.exists(f'e/blog/articles/{html_filename}'):
                os.remove(f'e/blog/articles/{html_filename}')
            with open(f'e/blog/articles/{html_filename}', 'w') as html_file:
                article = Template(open('jinja/article.html').read())
                text = re.sub(r"\[#(.+)]\((.+)\)", r"<sup><a class='footnote' href='\2'>[\1]</a></sup>", text)
                with mistletoe.HTMLRenderer(max_line_length=20) as renderer:
                    body = renderer.render(mistletoe.Document(text))
                rendered = article.render(body=body,
                                          title=articles[files.index(i)].title, date=articles[files.index(i)].date)

                rendered = find_definition_list(rendered)
                rendered = re.sub(r"\[\^(.+)]([^:])",
                                  r"<sup><a id='note-\1-ref' href='#note-\1' class='footnote'>\1</a></sup>\2", rendered)
                rendered = re.sub(r"\[\^(.+)]:\s*(.+)",
                                  r"<div class='footnote'><sup><a id='note-\1' href='#note-\1-ref' class='footnote'>\1</a></sup>\2</div>",
                                  rendered)
                rendered = re.sub(r"\*\[(.+)]:\s*(.+)((?<!\\)[<>]*)", r"<abbr title='\2'>\1</abbr>\3", rendered)
                rendered = rendered.replace('<pre', '<pre class="prettyprint"')
                rendered = rendered.replace('<li>[x]',
                                            '<li class="check-list checked">')
                rendered = rendered.replace('<li>[ ]', '<li class="check-list">')
                rendered = re.sub(r"==(.+)==", r"<mark>\1</mark>", rendered)
                # TODO: Heading ids
                html_file.write(rendered)


def build_blog():
    files = sorted(os.listdir('e/blog/articles/md'), reverse=True)
    blog = Template(open('jinja/blog.html').read())
    articles = get_attributes(files)
    blog = blog.render(articles=articles)
    if os.path.exists('e/blog/index.html'):
        os.remove('e/blog/index.html')
    with open('e/blog/index.html', 'w') as blog_file:
        blog_file.write(blog)
    render_markdown(files, articles)


if __name__ == '__main__':
    build_blog()
