# Engineering Principles

How to build and change the site. Several are adapted from
[pstack](https://github.com/cursor/plugins/tree/main/pstack)'s engineering
principles, scaled down to a personal Astro site. The reader to design for
is Patrick, who rarely reads the code, and the next agent, who starts with
none of today's context.

## 1. Stay a contained Astro site

Static output, a short dependency list, no backend. Add a library or a layer
only when it clearly removes more work than it adds, and remove one as soon
as nothing needs it.

## 2. Pick the right tool for each job

TypeScript and React for demos and anything interactive. Content collections
in Markdown for words: case study copy, articles, Lab entries. Data files for
lists. Words people edit should never be buried in component code when a
content file can hold them.

## 3. Subtract before you add

Delete dead code, unused assets and stale docs before building on top of
them. Prefer the smallest change that solves the problem, and when a new
requirement arrives, reshape the code as if it had been there from the start
rather than bolting it on.

## 4. Minimize reader load

One obvious place for each thing. Fewer layers, fewer files to open, no
wrappers with a single caller. Comments explain why, not what. Match the
surrounding code's naming and idiom.

## 5. Validate at the edges

Content schemas check frontmatter, so a typo fails the build instead of
shipping. Inside the code, trust the types. Make wrong states hard to write.

## 6. Encode lessons in structure

When the same instruction comes up twice, turn it into something that runs:
a schema rule, a type, a check in CI, a script or a skill. A rule that only
lives in a doc gets forgotten.

## 7. Prove it on the real thing

Done means verified on the real artifact, not "it compiles". Build the site.
For a change meant to be invisible, compare the built pages before and
after. For a visual change, check the preview link in both themes, on a
phone, and with reduced motion.

## 8. Fix root causes

Reproduce first, then ask why until the cause is clear. When two fixes on
the same assumption fail, question the assumption instead of writing a
third.

## 9. Small, verifiable steps

Each pull request does one thing and ends in a check. When replacing an old
pattern, move every caller and delete the old one in the same change, so two
ways of doing it never coexist.

## 10. Treat the repository as production

No plans, QA notes or scratch files in the repo. Durable knowledge goes in
`agents/`; everything else stays in the conversation.
