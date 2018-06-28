1) Aantal karakters onder de 80 regels houden
2) Elke statement eindigen ";"
3) Gebruik const in plaats van var (is netter)
4) For count functions use "let" in stead of "var" (Airbnb guide)
5) Regelafstand tussen lijnen code aanhouden
6) Gebruik literal syntax voor array maken. Dus:
const items = new Array();
const items = [];
7) NEVER use eval() on a string
8) Use named function expressions instead of function declarations.
9) Always put spaces around operators ( = + - * / ), and after commas
10) Always use 4 spaces for indentation of code blocks
11) Variable and function names written as camelCase
12) Constants (like PI) written in UPPERCASE
13) Only quote properties that are invalid identifiers
14) Do not call Object.prototype methods directly

Vandaag hebben we deze uitbreidingen van de stijlregels gemaakt:

16) Use array spreads ... to copy arrays.
17) Always put default parameters last.
18) Avoid duplicate class members.
19) Only import from a path in one place.
20) Avoid linebreaks before or after = in an assignment.
21) Disallow unused variables.
22) When mixing operators, enclose them in parentheses. The only exception is
the standard arithmetic operators (+, -, *, & /) since their precedence is broadly understood.
23) Don't use selection operators in place of control statements.
24) Start all comments with a space to make it easier to read.
25) Use // TODO: to annotate solutions to problems
26) Use soft tabs (space character) set to 2 spaces.
27) Do not add spaces inside parentheses.
28) Do not add spaces inside brackets.
29) Use PascalCase only when naming constructors or classes.
