#!/usr/bin/env python3
"""
Blitz SEO — internal-link concentration helper.

Applies the *mechanical, safe* half of a Blitz sprint to one target page:
  1. Adds a keyword-anchored internal link from each SOURCE post to the TARGET
     post (idempotent: skips any source that already links to the target).
  2. Optionally bumps the target's modDatetime (a freshness signal).

It deliberately does NOT touch article body copy, and it cannot do the human
parts of a sprint (earning backlinks, rank logging, GSC resubmits, forum posts).

Dry-run by default — it prints a plan and writes NOTHING. Add --apply to write.

USAGE
  # inline sources ("slug=anchor description")
  python scripts/blitz_internal_links.py \
      --target how-long-to-learn-cpp --freshness \
      --source "cpp-vs-python=how long C++ takes to learn compared with Python." \
      --source "cpp-roadmap=how long each stage of the roadmap actually takes." \
      --apply

  # or a JSON campaign file
  python scripts/blitz_internal_links.py --campaign blitz.json --apply
  # blitz.json:
  # { "target": "how-long-to-learn-cpp", "freshness": true,
  #   "sources": { "cpp-vs-python": "how long C++ takes vs Python.",
  #                "cpp-roadmap":  "how long each roadmap stage takes." } }
"""
import argparse, datetime, json, os, re, sys

REL_HEADINGS = ["## Related Reading", "## Related Articles", "## Related Guides"]

def load(slug, blog_dir):
    path = os.path.join(blog_dir, slug + ".md")
    return (path, open(path, encoding="utf-8").read()) if os.path.exists(path) else (path, None)

def frontmatter(text):
    m = re.match(r"^---\n(.*?)\n---\n", text, re.DOTALL)
    return m.group(1) if m else ""

def get_title(text):
    m = re.search(r'^title:\s*"?(.*?)"?\s*$', frontmatter(text), re.MULTILINE)
    return m.group(1).strip() if m else None

def make_bullet(target_slug, title, desc):
    b = f"- [{title}](/posts/{target_slug}/)"
    return b + (f" — {desc}" if desc else "")

def insert_bullet(text, bullet):
    """Append bullet to the first existing Related* section; else create a
    'Related Reading' section before '## Take Your C++ Further'; else at EOF."""
    for h in REL_HEADINGS:
        pos = text.find("\n" + h)
        if pos != -1:
            heading_start = pos + 1
            m = re.search(r"\n## ", text[heading_start + len(h):])
            end = heading_start + len(h) + m.start() if m else len(text)
            before, after = text[:end].rstrip(), text[end:]
            return before + "\n" + bullet + ("\n" + after if after else "\n")
    tyf = "## Take Your C++ Further"
    if tyf in text:
        return text.replace(tyf, "## Related Reading\n\n" + bullet + "\n\n---\n\n" + tyf, 1)
    return text.rstrip() + "\n\n---\n\n## Related Reading\n\n" + bullet + "\n"

def bump_freshness(text, today):
    stamp = f"modDatetime: {today}T00:00:00Z"
    if re.search(r"^modDatetime:", frontmatter(text), re.MULTILINE):
        return re.sub(r"^modDatetime:.*$", stamp, text, count=1, flags=re.MULTILINE)
    m = re.search(r"^pubDatetime:.*$", text, re.MULTILINE)
    return text[:m.start()] + stamp + "\n" + text[m.start():] if m else text

def main():
    ap = argparse.ArgumentParser(description="Blitz internal-link concentration (dry-run unless --apply).")
    ap.add_argument("--target", help="target post slug (the page you want to rank)")
    ap.add_argument("--source", action="append", default=[], help='"slug=anchor description" (repeatable)')
    ap.add_argument("--campaign", help="path to a JSON campaign file")
    ap.add_argument("--anchor", help="override link anchor text (default: target's title)")
    ap.add_argument("--freshness", action="store_true", help="bump target modDatetime to today")
    ap.add_argument("--blog-dir", default="src/data/blog")
    ap.add_argument("--apply", action="store_true", help="write changes (otherwise dry-run)")
    a = ap.parse_args()

    target, freshness, sources = a.target, a.freshness, {}
    if a.campaign:
        cfg = json.load(open(a.campaign))
        target = cfg.get("target", target)
        freshness = cfg.get("freshness", freshness)
        sources.update(cfg.get("sources", {}))
    for s in a.source:
        slug, _, desc = s.partition("=")
        sources[slug.strip()] = desc.strip()
    if not target or not sources:
        ap.error("need --target and at least one --source (or --campaign)")

    tpath, ttext = load(target, a.blog_dir)
    if ttext is None:
        sys.exit(f"ERROR: target not found: {tpath}")
    anchor = a.anchor or get_title(ttext) or target
    today = datetime.date.today().isoformat()

    print(f"{'APPLY' if a.apply else 'DRY-RUN'} · target=/posts/{target}/ · anchor=\"{anchor}\"\n")
    added = skipped = missing = 0
    for slug, desc in sources.items():
        if slug == target:
            print(f"  -  {slug}: skipped (same as target)"); continue
        spath, stext = load(slug, a.blog_dir)
        if stext is None:
            print(f"  ✗  {slug}: MISSING ({spath})"); missing += 1; continue
        if f"/posts/{target}/" in stext:
            print(f"  =  {slug}: already links — skipped"); skipped += 1; continue
        new = insert_bullet(stext, make_bullet(target, anchor, desc))
        if a.apply:
            open(spath, "w", encoding="utf-8").write(new)
        print(f"  +  {slug}: link added")
        added += 1

    if freshness:
        new = bump_freshness(ttext, today)
        changed = new != ttext
        if a.apply and changed:
            open(tpath, "w", encoding="utf-8").write(new)
        print(f"\n  freshness: {'modDatetime -> ' + today if changed else 'no change'}")

    print(f"\nsummary: {added} added · {skipped} already-linked · {missing} missing"
          + ("" if a.apply else "   (dry-run — nothing written; add --apply)"))

if __name__ == "__main__":
    main()
