# Mobile Satoshi instances

`Satoshi-Mobile-{400,500,600,700}.woff2` are static instances of the existing
`Satoshi-Variable.woff2`, generated with FontTools' `instantiateVariableFont`
at the corresponding `wght` value. Outlines and character coverage are retained.
Each file is approximately 24 KB; all four total 97,952 bytes.

The source font's default axis is 900. The Windows WebKit test runtime rendered
the variable face at that heavy default despite requested CSS weights. Static
instances remove that ambiguity without introducing a different typeface.
They use the CSS family `Satoshi Mobile`, declared and selected only inside
the phone media query. Desktop retains the original variable face.

Recreate using FontTools with its WOFF2/Brotli dependency:

```python
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont

for weight in (400, 500, 600, 700):
    font = instantiateVariableFont(
        TTFont('fonts/Satoshi-Variable.woff2'), {'wght': weight}, inplace=True
    )
    font.flavor = 'woff2'
    font.save(f'fonts/Satoshi-Mobile-{weight}.woff2')
```
