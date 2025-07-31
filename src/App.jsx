import React, { useState, useRef, useEffect } from 'react';
import OpenAI from 'openai';
import { motion, AnimatePresence } from 'framer-motion';

const gerb = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAABgFBMVEX///8AXZzKy8sAoOP+/v77vAD/wQAAUZYAW5v/vwD/wgDHyMgATpUAV5kAU5cAUJYAV6EAWp8AVaIAWKAAnOIAVpgAicoAmeEAUqUAVKQAS5T7uAD3+vwAXpkAWJcApOfB0eEAT6ff6PDP3OgdZ6KswtefuNHT09JSg7Hs8vfb5e5+oMIARpHc3d1Jfq6PrMkycadSc4TrtRgAnuxxl725ytyWscwpbKS8n0mDhm5hjbfo6Ohdd4B+g3JGbok/bItzf3bfsCjS6vjXrDGPi2ixmlPPqDmik10AP46VjmNoe3svZ5AWYpXFo0L++esATKmIye7AoUfmsyD/2of80nL/0l7/7L+13PRiueoAfLyg0/HF5PaRjGf/xy398dj/3Y89rudqveuplln/46r/0mL8xj/97cvk49f95bL82IyznEN2vNFYpryHrJxYeHiysXXUtkp3qaZzqtPTvXYAb7z/+MmVoJFGpcehnn3jvD2TrZSmr4MUgbhMpcPMtV5Gf5eUzZ2HAAAgAElEQVR4nNW9h2PiSNYvKrURKqkVEKDGIGEwqRGYYAaMDQ7gbIM9znYH59S7b/fut/N23t7vu/fd96+/c0oSyaG7J+zsV7s92EZS1a9OPnWqxDC/e7Ny8XQmX20Uy/VUlGXZaKpeLjaq+Uw6nrN+/+5/z2bmaqVGWZFU/qWmSkq5UarlzD96qL+gJdL5si7ZKCKknK2WZjLpWjyeTCbj8Vo6M1OqZsskYqMHnNV07o8e8ne0XKYhAzhFlfRiPhNPvEwhM5FM57OypCowE3Ij898BpVmrEiSdyjYy8UEpM60cJV+NEjJnmZ7+d1Yy02CRmpJcrf1bc6yVzqq8wkupatoFZybimXyjnNKBIQED0Ar/qcC6eqrcAAr3ZNCqVVMS3p1N/5vqH7OWlRQ6wIT9Bys+00iBLCq6TAhhRxv8TdbheiXVmHGpbaUbKnCsWkz/+1EyWUXBU6pxm/lylO0Q2giop0hZAMqrxBVCT7yqIMhq8o+EM9rMTArIpzTi9DcghCIp8iAw+MeruprKFnUFflZVwMTLQzhlRdIbDn/GG/A0KZX5dyFkIq/wiuQwVq5UBnR9SsmSpBYbdVJMJktIJDOjkrKVKMVz8arOpgjP98lKAGWdXsWY6WIEWL6a+EOR2S0J0sfzeTqUXCml6s6ACf1BrlpmkknCDyX43qymGSbNK3n4mVKrlsrF66CGBuitSykbZCIPfC9l/2hmTRYlYL4MCp8FrOrCA1OYzRTxFx6R5XWWRBkPMyNNAbCU3oCfGw34Ij6FYJmq3JsSB2QGJ8CThgmTin8kRsQnlWv0x4akEFfoUrVknEmq9NciIgOEMnxmFBWGW1Wq8HNWaiRrUT2PYBV6YanMu9JLFMkW6nhZ+gMxJrIRp3fQNKozNqWeUtj6DA6OtwcLENIAIUI/I0CbqoqwykTmeVZJw4/OnQkmk2701I+s2poGZzGS/SOcHbOK9KP4SgolH7KZCgQFiiEzmhE60ohpg8XP9BTyZxk418PYUJCmlmT/GKd4QPc4ioooSh6ZNYl0rP7L9WpG0vkUjsmqRqgAEVkuVXXkSUZilRp8pogCegcxJIBhJRhsGoUyqSoZ+LaPP6lSRBL8mJsifM1sRBX7T0SPVBFjvM7rUuZfii+ZArKlKT7JJoZSbCSYFA/DKIHekFHSqiSdzOjAh4yJCBOoOhOeJEHWdAmHPDzDZolsC2xJZ1V8vidZ5F1rQzGmgaCpf504AoPKkTxMuZnnHUWv0xkuS3GmFpGdkWdwRMkpZEngYhVEKa6qMoBFhAmpp4eqcFlD1mfgx7oNPwnud15xBFLn7a4icuRfxao1WVfLaP8yCuVPDcfBI9XSU0nQIFSoAE9iM29bBVQrLB+n8ojfKnHG0bQyXsHW4VmKlHNgK+WUqqYY+0Ea5VUF5y9RVnW59i/AZzYkGeeZiaeoftH823SqUc7MTU9uinItFTUZADMZFmHKLF9zYdlgFecyxlLx1iJLrQklmqJLWYYqYHbbTzHaIp+GLxq/OxnjRFezMCIrK9n45tvrPjpY5LI4k5nJs4CRZNHkqWA1alMmNfk4KzlHveSc8VNVmlR50E4p5AHqI8j5mXzaY7sBvpX2vI1RcjrV5fjvCzAvySoSMEP9ZuJfXBHFbcqm6LQ4QW0W9IYOP5ck8FjSm8DQaYnlUSobVOsCgZgakpOgVZlRwbvxbNaoQgKFAlPFmGCCUNVo26K4vuSnwFGLgcsnS/nfEZ9VV/iyhSLBY6eB7r4otucDrMt7YCGKgMcD0oaA4pswqHKK8aDeyNby5VLW9lXTjQwYPpgUtB4NOgVI6RovZ+PpVKTEWOAA0ocG5tuiOBsNUFZF4bfA8an/bhFyHCYQx5SJUAb1rQpiZTs8rTmeFurFvKqghZdYHS8Eq1jls6WUJANVIeJwPE9ZkRU6RSRfK3nQB89JZZRWHXWOpUYSjOlcqk2HtyuisOqjrBpBMpYkGQX592iliCyjC1KkDOafx57HF7htByGLHlkiQj3NogJil4aAiejU1Xkm7nWwKmw1k2nYzh8PFoNJlGSUzrxNQ22BWxjfEsSDecqqahH6SBI5Uvo9AGZ5pYz00VECteiOV9wPLB6IgguQ1W13EzUjU2XzRQhy9ReQDaPUZVKv1UxTQsIThaimq4mAkUEOFuUdYFVZoxfHQUqLCp/9zfFZKZ2KeJ6qQ988J3DTGnS83tH6Y2VQoNSkVQUKyC/R7dlGFD6VycpgBlOKVLW9G5uIS6DLdrRpQeAWqcBH6CgkPfUbC2NOliX0tcp0an0t4U5YmQMxnCdLfSRo8piaXpZ1+RkQXwUJ3KxXwQ/EwMR0n6otERSHVps7ErYpRAV1XVqS9d803oiDlUfTJdOhw4ze3nGcV/g8vuptkYBLRWAysIbsc9mmb22KHQvmUrbnrQWiC97V8IbXy3FHt4Kt1Ahqg6Qig4v4m7V0RI7SicOUksZq3OGDwQnr7DTM7pZ/a8EBRWaK/C+h3mAjKilm6zS0ICQ6txW48YqVxW5b4IyHQw76xiFQdorKkfRvBXAmoqOOoSKoRf9HYE5kDu+9Wz6whjsBQCmuhZc05CD9ReoR/N7vI6ymaSzx+Vig/EsX2ynHAFnCDirT0XVQM/414f6QERd8rSjSEYXRLOuRmd8GYElSivDRQCfDt8hFAzd3jOfCmOOgewLKZifaWRe9q9oLAwbPzkc6czdatF1ZCO9wO+GFyoqvezPXIT7/yzdtoBbrArodMs+J3Jyx62HubnxdW+HwmOUpKtJvYjUAIKhmTxF1jH9BXPdrLe/JCccJwto4KJuDRXlWFA+2nxsrpZy22j4Id0RxyV/xfh7f9+6Pf/a2w+COdcIH7RZS9FmYWutA9K4FpsEezYXXQJXeP5yAg+hf97b8LAosuIUN5bdw4UoSzpdZRwHzb4F2CbC+fcPgOG5tesXLzU2CPa60niEG0UhnYVajvmUH0C2Mrwgb47PC7PgGoNwSKn6ErZHo/naUfYZlNX8LxPzz5KrgXZleg/4MY9bPBj4L3lWEKNdN5Cv1V0O0AYJYI8DP4r3Q0oiP3EB/3LkgCAugyrnV55jN15kOtEQRiBTghK3xWe8a/bdG/22M7wDSLaENQ94SxfnAdMf3HHt/BkmYXxAE7z30x23IPqK1hGPvKl5MlV+D/7WMOiMpCJC6Xdq8cMKBUYreCOdc5Y45NAxDAM8mGngyNJ8WWBc5ObwitH2s70ZYGV/wroxveXcowh2gJ6WpdzUAillYDxNOXA9oT9k1EJ0VvQL0c8jcHcCU3kQD28L5F2GeuqmsRRn1V6mbdKQPkA1ULk8MYZsYRw/itHHCfPnTl0OhMu1/wmCBxZ3FwLZXuAkvit55TVv0CtGOl/O3AOWN92Z8RZwmgtCJCkKXaHOCtwNy5t3Gu55AJP7pinD05U8nzEllXnw4MkhLME6OKnRSHYi/xmjEI3rRAUiIti0wx+fe6fYlaO3JnfuHi9t7YePJvGsBrSUKFS08KwhL4R1hxc/6DyjROkviweSGuDF54O1OeyvjqLVYf0WYDS95hbWwVhHEaS3w5Hm+DeH+9uLhfGdyC6zUyrbI3XmEbY0u9yDEoh6J/1KAOUkug5KJwrO0Tsu/ccdcXBh/vr8EK89qs4ZR2eg+kR7f3IbffyMIO+FARVgJdwRxUQsAe07Oii1W4GCUW5Oc4J8TZyd3QEhBLwvdcFuo+GAyQL58a/P+J4/sblRAy2gESH15v2M8XDDHG/4WOsQkCuqmLEu/MAtn6TI8wINaVOty3cDcucdzDEZipxsGzD6f7A+MMChhAxCwboT9ONrwtNfbArnb8ZOuyPkWxJtJjgusiqsBoTK5Bsabg7AEwN2Mz3m9i+FVpGN41iuuBEaDLRLwy36YSxLu7IDZAGsszgVgRBpqVA+QQJZ/mRuekhVkAgQYrVTAH6kIqNHaszetaNjv6zyRP98SyBwneD/7A23Buzi+JnBaFMSM+FfE+a64PrkiROfEuaiwPtkWu/PirE+bFzmWcMJGeFEQ1v3hGy+EEJr2VLGSjt8fjrZuZtuoxYUDjfVVKjgTMoqRgkHJ97esjsTHVRNCKsIOOloLFTBLR2gluEplaRQhuRFXtECHE8Q5fxSiK+KrCGvAlrN+bUFcAwKGZ8XOgrjQEdf8HJJxGu331uSscOCXYdSBMJhbrhPQVsSt0Wdr01wF2Ee4PwJ8lQVgHv866mkw/aAKk5L+C+LFEo/+bZ66aivniNC/DQ83dh8M4/7eu64NqwSioYIRKl1ftyJ4W+EloMn4ote7BMzY1YhQGZ8Vu1viYktsLYqfOyCGwBbaosj5p73C0vi6wHXDq6JzvwASOoIRfD7h/t4wQBMAK4GwAsLzfZRZHtNdEv/dZjEewXXMNDrbgTnvF6Pth3j3kvssMMzF7iHomuERaOy0P7AEY+OW/NED0P3j814gz4a4Mj4n3vjAhwbqbbfE+W1xex5/AEpuBPw74sL4AegeIN5SGGboIOoHNhcqS4FAZwQjAZ16uHvBMMICdynua/4D49a7QN1wpITyvQrV4pHBkzT1rhlfjozK+No9c74Q5e7QCC6OCIq2VBFv/AFtxysI237SFoRpQOadhuG3xisCOAviVlfcWBIX5sX5BXFpA+m5pHW8lclVsT0+7RW3x8GAtkl4W+C8O7IWnhPa3RHDAabRe/jljosunDP3wOjG0ReDXoLSVJb579M2dVk2GYtmIkCIGONcWBR2j3fCWme2vbMdHumbdEHshIMlP2pEcTUcWBGExckbL8cuebnAtrgVCHDtycq6Jn6eFqc/i4H1ymS77fetidssmH2WE1fHpwVhJRD+LKIWDnTB4/Vy3VFODW/vtGc7WnjneBfGc24APalzA6rUlOX69wDMK/a8IPsF1g6ZP51U2sfibACZJTxq5CE40NhZoJ7w2e9fBLu9BubCyy2Bd7YCimZtss0FfDci2efG23Odnc5ce5zbJ2A1ot6VH3fEuckVcW18UQCz4l/zAn/4/QvAqd7ZqBYY1aka9A6wA7Picbty8ifm+CaA8SKa7aSkfIcTHqeCi6s/2vy8f+2IYY6ASNv+sN/vJ9OjM9tdWfUF/IttmPaVrp9d9wo7AVCbXNfXBgemLXamxTnfone7A2YD3XbNTzqdbaHr2xAXp8X1HzfE9fEOJ86GtXXBu876WZgeb3sRmH5jVJ+xZFqGMYRR6XGHDHMPlh9dPQRXUr49rWESnJR4BH0GLqpNC0fHYAcPQJOurB9wI1YC9DiohlY44J9Ddb4QDm+JQpsdXxO5KLDfdFdc+XGd82FM378RfEBwz8BCVgQyLx5AXAtk7B4I4lY4DIMXuDm/jz7vYMTqkiWuvb4C2vQA7OLxndDROhzKEuqZsky+ddmmoYPUWhjxhle4ABuY3/8zPO/2CEIJsFcjs6ptr4AV8x7M+/3Iqt716Dhg5jqgRytsB6ziqjjXmX4uyNXmOxsgiBwXjVaA2IuYoByHcBoYlPVDcAii7a0sjHYH9haCjcNbmPP9/UUIL70rNCKGEfN649sA1iRcfEFfxrfl5aAHmFaOu2XOj0+OuFEFh1HcNDAmhKmL4TCwKnDzeHRFFOZBBA988+LK5HrriTvt3BlYmJ1c8S5pFXHrx214QnR8HoxpGx40DzwPP7WeBlTaEnd0cnzO3IL3sR0GLhOELZ/t26RV6ZvWF00ZHYSMivMlnAtR4t84v7+p3DLM7nklOmLnHYxLqGi8O50wspZ3VhvfEL0LP86BIZgDxnPvAc2BMuT39RBrwNLb4bY49+Nn8GfHfaBpuLnw+BJOmbhuL6yNZie1TuV8lwGEN/fihl9bgjEiK6sZdMPkb+HTqg4UT6Cp968f3Qvb4Y3zC4HMeeHntRFXW1tyolbN310DIfSuRceRVSvTk/OcuPFjS1wJt9yFG59vemMHxIc72NmY9vncJ22D09oCF46bn1yseMVZdryzQ6drycan+dil4WnVAmvC/Z0wR4SL8w0wnMdH68inkQRIll79OsAk5VFcYobp2TUgrBaYuzUc3mpnJLAJTIvc7LSPwia+6AZqmg0yCawq3oSjbXF/fB5CCBufv7PGwcA5bDB+bq3jeEW+OXHevy62o0B3sb04GV1DuwNfaxQMKAGIM0dtf2d1YxEirUNG0HYEY5cSkZQpn349kEqhHs2gOxrYut81vCs3h4cVCBG1/rS7cwmxOyqDDRgN9hAgnyvwl8/+8TlOPFiaREfc0UuBKFCWG2zAy92Aw3XRAzCanbbIzY0HNtCt34j66APDSzf4RIA4Gk/5gHdItHJ5uNH2Grv3WzTDiKuVX48yMgpSG1f3iG/nkjkCgT5va/6AL7w4mjDU5tcqSBbQCKtRnHISgOjDC/pvUpsVUXlAfESvDLe4YXwUI9cK2xRZ927/uAUMqo2vwsO4VYJcAYz/+QCnBeZwdn6064WlMNhg7eCcq9weMZe0H8KjdClfqbsxqWeQRWem418Hm3rHCe2t2bW1/UpltBdN8/mXtsAHRQlcb1GR1Pzbbcye/rjUFtvdTtSGAFL2XIMoihIk2gGWbi/92KqI3oMF5Hp4Vgu1DbT2xqLfp41GMlGusr+2Nrt1IHDgjxzO+mg4nKXe2OvKpqqD1YxLmJCdDyyIlxCOccY57WrEEAYWlgKgFAP+7twOCqDgiKQWnl8XxZXFHxcEMUqZywc+yvPNu+Ozx+sVFn6cP4DbsPYCVO78rP3I9bmuPxAAYi22hh040BHYznF4R5fe+UALyQxOjUleVzYJiQc1gws/AW5a821VMKS+ODLuL72t4Zyhf0v0cjurSz5gYD+7TfkVRTKsgVe2aC8s2tbaP/uUQ3ucOhu2mc5eJpwGgdbCSxv2w9a2WT+y4uLndc4Ljt/wBLe8l+fGny4A4krls0+br2CaI4W1DNJrZbdZPWWrGfAZYVJ8/rZQuWMeHh4w+TQ0h9uioxR3PoOrDDZucaMN3ogtkpq/A4Jo86Bv9SUKUirS5C7rx0XeDt4YXW17IT4B3vThYxe31h0VLI6kGv033ouHB+auIqxPBmh45rPrc+qvxfvJCNJZISzpCMIqzCdI8qq4y1yOAmTBKbb5iKJc31rUwuHx7ty6IAL1UCTBQG5Rfb/0GkCASJk/sLHW9VPhg/sF4M3xcFib3gJP3OlCqKx/HtED4Q3hktkVt7jzFR8bWMXkK0sUlLHIyxajqJftGgH//rmw7vetH1+uhXfA/32a4gPe7M5v7R8Itj5AlNPa+LgG/CpSK+mzfQH/yss8SvmUepXwOLC4s5woVma38THTNu3okw/2P893/U/9Nz+4eMLO+M7l/boPcxprPlpLwJQxyfsCCSWwl2gpwNm7NLzdRZGBQNzX7T6JCNHxggYwo9Nza217MF5uBZyVyTDyqwgiScPn7ddJCESkRoh0NmBmgDfDk4H5jZXeA9fmptl+ZyMQ7aFtwygXu17jlpNti0FhvETCImpTuHVOfDCEuZvLy7afWqYRgOzB+trq9pKGLibMvj+w1LqBOccmAEr/ZHRuXaTu2tdI6BJRWxDX56KTfkAn0Odw6zetTsDvww78fnlp+/Paens0IO6iFQ5ULi83tgTjghZnoSYtvkREm4SYmvHNHj0Yx7MHdxUweb6lnRFbD9qRTrG3sjK71VqMaqgTwuHu9tZOBQXRi7S0Vxa+IoWUiNRhIQHwC1e8KIaV/a3tbhijbX8gutjaml0BO0l73BgxGa0d0OV+YhwdrN8ZD0c32Kf0ChGzKIW0bN63fui5PamABz23tlMRZ0f06LzoOJhU2YDfsTK7sTDdDYxDY6dXZ9sgT+I+jgacsK8iFDZwYLiiDZHz7Op0FB8T6E4vbOy3K7aYu52JIw4q+LOVHWBk8I9O/uQ5pNYViVh+Xp2CLYzbxdngr92hN8OhvwIGZyTLrgHslXaFE732zNoNgLZ3Nubmu+HJSX+ntbb6bUzaY9PVtVbHNzk53p2fu9lpc8LQs71A2YMVADPi2nQFDqJyA0JF8Gzu7NAnAupUfdYm5pWUrUgDrcC0QL2Z4xODuxVbo+uDKPSg+0hncb41t7G2v97GfDRKj0i5DIR03o6UfV8HCBAp7wUQ2jrlcpEKtCBU2uv7axurC/OLHYLi7nsSSUOIfssZX+7BLzm8FBYDKPtYWJV6Litl8uDOoC3UWmuBwHZ7p8IZuxeHu+f74VF80DSq3QKoZ3xUCEl3CeBu3cyurwBc0a7JJJ2viyGaRHS0Wzg5HICavdmaa80vdYktiqhrBvobjaNW7ncPLyDIO9hpbwcCa+CmoE3M8PxT7xT+aBfphtvAz9rkhrBuPDCe8/YIBcHibWxtrc4tLLS256enFzudbjfKygGw+NgmoY0Hop1pTHZq099EQ8zikO50Jxqwb8cW9gdINNrtdjpLi9Pz263Wwtzq1tbG2ojSI2zl3MM8GG1hblIDucRYGOuTef5piEEJCx6ptiRW/KhN7hfWxWNh5ckCAicMSUhfFVQqB+2V9fWd/dm1m42NKJ2Nb0JIyd3d2LhZm93f2VlfWWkfVCr0G7uHQZGsjDpX0bZwLK59PvZOY8UA8gN6p1TknpiKBEgosPYaxtRd40Fc8rW2tkfXsANbA4MWhpsth7YgiZSG34FwSRy83Tv85AGWHk2+Ef82jHLx/MTAVWoBHRs1DmrzicGoYlUQ7snRuDtwhVaPdw0/qpToqJbhxGdJ9hn4Ftl2cQm4FpyEceqUfjuXsto4mG/gSpspgSc/bwFRkarrK20gqjOlIjeq96KogPzG7vHCeJs7xtyg3MBqopEgylSVNLX2wJ5fDO/i7C3q3oD/82h0HV2ickc06vqjIrDNfZjKodbtLG4vfN5Y2zmY/k5NM9/eWdv4vLC92OlqKIfY+h3AJ4gLyuXSyJxr26sgsoG1u9u1aXDd6HSB1U8rI7omzaMGwjT+5+MHwzvbPqr4w9G5yijb2ztdHcWGnYd93aXpbVSiOysHOMe0gWlcRPZ+xlo88xe0Ftr8DnUUUKOiSt1xVWog7OhT7PS5bbb+SmUuGvZXjtqzXuPhHE0m6BpT4Ydzp0VcSqWR7w3w5xfMtt60vYLYGiFhgE5md7FvGfp2H6UHbOFWaynw46RGHe9nLP7/dT8KkFp80tEmf/RT97MieAeeKXLULCLcxS7RYACj2ZQWxKXtmxbMy63hOcakFOqahjLk11gqSGcOXdLAxj0D2perGOccdz9KwsBndGaEviLgHIXHAbTP20ssmAvwTzfA1atQr21rBKHwlx/Me2P4TzRR5oM7dja2O34wFlpne/Vm54Bz9fSA4ga4K6sjkuivwKSdc2C/HxjGTrtJOdyBNLigmFYUhhYea9q8sMscg4/wwHEPT0iocSOa1CvQMKPDoiiOB5YWIMZALt2Z69hB0bAgCn/9IXjqGYbotcOsztw+vRMCpkVCxVC2fVNuwCDZbD66PNuCSIh7QB+M2QU5dPwauqes17KoedAY/g/Ntw9GB/28E+b4YNT4tIQBaDs3c/MdDD5QEVCPW0B9z+3PdSb92/vUNkNkOgjwbz+MjZ0xQ1QUaMJaa+1v+ycdlPBsDC8cPePEF32g3tF1Hv8BjvYI1DtaCw39mhRahwE2NV0m9a+A4p1vzQoH97hmOLrO5NuB3jErDw42jQ0xDxawudJLwylEN9mF6FDkqJeszQ8QUfgPADgWNIcgeqm21uYA2vpcdxJRVigYEULEhSVid+Pzh8nS9ioIKbiEa6NuVsfAtcQDYbY172cJThmyKT+QV6zxKq2OJwTzT4FFUZzmzsXKaDIdhBSDJCfmBuoRypVOtqEyO9cJj9sRvrA/77iQg0SsjGELfWRciMJ/GDYJaQZxHxTxAUT542GK0slhYEDVdbsEpHJnflR2WG3RgCmdF8UOzUmBLwds6pEGtCklaBmdbowFwweXoo9tbY+uvyJEUNhYF+sLR2kc6GgcEdH5wuPaNqZaxJUF1h/wd+lAMMBx21WQQrQYjw1R+OvZiUEX67VWF+5gF1aQyzFTE/YhSjQcVCKoEgKGxSGRZ8alaa0WK4uXWEQ3i04/LmJkB4y+zNvm3rcjCN3A/PluxQfP8T2pCYInAQUpVwqumgPaLXTQ6GOmDZT7wVbXSSfae00CLdFVoxRgcJnxeChE4e8/BJlEim7kdpOJ3a0Kmh/gVzT3nbnZirensKkS0sA2Pim3JUs+mHqfsXs+H8AqwIBt9HniAsxJ1AlAVQmu9vjW4ck6RBfa+qhEE5srRUezoR8M6MIYuQFveumS0mI44KSE97t2jOi343xQo5SCMRMRIsS//zAWPAUGkojWjWJV/KJfI4HwIl2k8tKMqc8X7izMVvoder2ghOafFGlM44K/7+DkcGu8LdyjggRFmpB6cXCGT1GflHSEW0NYvbkUp/2B1hN/Br72Cv0FMko7UAN+dnvWlpqd7YBPwy2JK7inbpwmlVlMbGIp2t9sgGPBmMeGuIx/OEMtENkWN8aX1t2kvk/b3rEle22b+NF1QpTegcyJOAoR/JqWz799frmxKhi3HGv7pqleCNXggWF1go7yrnFemT3fia7BgzZ6KstZ6l1w0YmVtVbXB5wRoLxJRXFljq4/BfytA1FsT/84XxFnKTtN/OPUc2T8hwMQIF45CEP4yykIpVVcFyvzP07jmk7Lj8Xv/ujcikg5k65cgMT4uoDSdfoFJ0rs4cRFOe4munL+Z+7c2KW5YR24g2/0xLBGbQUgZLhbsCoQQBnHYq8MgjRS+AFxFU7gAaCjq0E+4M0De3nNWUMkAW0Vl9dak9110G3jO20fIe9i0MXjWL8Fr5keQtSsWHTfEsT17mQLb17VAqjN/J0Ne+3Q295a8tH+/F2HY53JTzV6I+yIx4Yg/Fngzm85BhGivajxsg0wgf4Net3AhrsMA94ad2ncXfbNvZqk+6x8FS+iC2PdiIrYSPIAACAASURBVIa8ydHlPYFbm6aVps4yMDcX9m8J4k6gUxEXlBSVNcZRo3YL7eF200TI/uUTQqxhccOWP4wVJtxG114g9U/jEpTNM9tYiwMRDZVLkbqyesnZV0zZ9PbYuISRnzPMroHEBe8bfNGEE1ewdmgIGA6ZE4Mzvjwc7QoDVoex6I41VOlAKdCnHcqbVCZ2tu21fGcpX9jQfT+1Ba7144JXmJY+jIVigOBsECCgorxpI4zZPGulcKPY9qS2hQ9Z69qL3LiSYetSL7ezgN3TuK1DxxaxmL6umRM9Rw9fYOwnzGHb7wgiy9uOWx7Z1dFJyIV4FXPX7pFQzjftCaC20Ic23fG5xbYtfMhUS/sCLVXQgCs9//dEeFasdALvxvZwFk9DY8MNCOciDFo2ROanbtvrXe9oE3Qhf98tVPB3Vw9Ex2AAv4YD1CTaEJr53jarQOWIQeocCL1lf1QwdsqtTAlK5TYQnVs8EP4s3t4PlM3x8fdNulMe67W21zh7Rd5dLcS9g6nU9LqI9RPdf4RioWVUzxWxrafGYqAsYfSe4NgoxARjhgakEjHGJ4F+f4lltOg+LTaZdopNNGc539Fx8xotG2ClRPO9c7oISz2341vvunAwPYcVMVh+gqJXpk6pDk4pngVAVLWe9be8QvRm5WagcIa33hYwkeoDvcm5lombnadFGGSC/OMnc1egJUOAz9Uju2uRDzHbC4Xf9p5AHDMdhGOhZReiVV4EeY1ZGbugxtvedpaE3FVhrsevASxle//G6iFkte7ayk1X8Lb82RSvEnrEQZzuSrbt/YzOqo+FzM+Z8RXBy/rHB+ouSMrz9i3jYX1/7leLrLdk2vnExId3V0izW+Fg/h/BGJo716I7ivMUEVqjbDo2dmW6qG0y4z2fQjbfmlUwHVgUdTAXCBAZTzbQfOzCurdnjEGZemBYnoGUBvGN+1kveCyZn0uFpsrqM+Cn4UkNtk4FOZMehNvL+pLIeSeq8YGjnki2+fZtk0lurjhzeLBq6wEykXpHNSUO7v+h+MDYmS5FXOsHs+hhrp8QMXgVczkWpghnidnrUzVR/BEL2yAY3PhwHc9GFGpAulsHjojsbCYZGJanOHjIVLw64eXETvnw1niIUFUjU+e7hLuGMTa0zo3DxgTQKZK/TFd798rV5ts370EhVajw3SzZwjfBfhiL4SA/IgmWneGGegBdsgVDV6c90/B8uwJswAlnvWtQESXrm7TY8a9B+M1MF1UE6fh0nNAGFfLmzdtm1VU1pFhNXzYkuGOiemQcJ+DiOsMUafk3KhxTIWru3jCE5uRcO+prGrfHOdfW6HlACERk7mzh02x4wVisP5yesgxSA97nOPq3YPB6+eypJPbJiWIaGutfQTmbSWvSRuWfP1BZBtU7U8djqDRfAH26O4aho+opUxj+rdH0dQ4WJpucYdwnVczuUzPBlHl0UtloLlO4hG8im9VHrInv0VAvwbOQiMz/1Gld0AT58G4s1h/gNfOxTyFwYCxUHczHQUjB10g4NjaCPnhFLQho5H+EgjaR6XkUiRKLhzVp/on/ySAJBxGS4gXgemxsRpL3xm0yk4ziiTgZHpWpYqtSlgdsD8ZxunBoGOfnRz36y0hDSkSzrINuSQ3Bw7Y3MP7g9VUITdxz6vPbG0bJyAf9X63l04/LeLSfrsp0z27h7RCX6vmj83PDuCzUjo2H7GaEZx1liof9IFYFLEg6E/np0LgUjMvmTKmQdk/AoXIIT8NpLLLvxmKx0fE8wXLlGfHTvnbDU4hARmZvgNFDIfh39RGPPGjgGrZJx2RmXU5T4oXSDDAhOJyXDT6dATxg5hMqOD45NWLSA9UeL7Py1INhGF8aU0VJKve82rIHnwZ8CuO+fp3deghiVy9/Gwv+5eqHr4IMfTx72lcwdHaKM+1BHsVZT/VHKUnFqeotjP9xSm5cPmpYl2FGVEzYEHqIUeb+sDFVvgXPLjmlpHfrPX+I6HS+3oDZh4d//CaIL0Gzh0m6O//5X8+DjPX/+PwcBENUdxfokAYtvlzeTStTSfRMy1PVo/uSjuaCAKumURjLRIkLxpfkiQFXPLCbcbHQc9shtHhvz1jTtgu/UMBiY+/++s8fYIJwE9qcKPznX8eegIx9gEtee34wlhgAOOC1sVJBPN1MPcD4jZPkF0OoKZirQTWasc2hnL8DAhvHh8eCcPJ4ZJz0M3a2Mu1BBPH4NoyxgbmAnz+wyoJ48L/+SeNW/za61//nLyNwUnLU+I+/D2jekZ4g7sIh9MbT97xJ4Itx9HhiCIAAgRzlZUyaZiHMz+MZVgo4pY+GcZurZvNJ5GXhfZ+G4KXbT7QhAhmvnmHVUdLGYu9S/xV0//guNQHAwhC/OotZNHsDgcx/jdnBP0CNjQF4rQMux/9yWBgk9p9XYz9Aow8KXSVo/wV3OObA8SLqI+4Xvk3mG/kcKJwmuKY0zM/DvxJWYBDthGrZlLRZv+CMx9RAJoSvNd1nFmxDdTo6ubGxD3/5Yegv79iJ8Bo12PAdO0EfFz4Qpl3e0Nwc/d/+GYyF/vfKX4Pv6N8xNwfU/X8RclDB/XDcf/6fv/3X3/85FqMOItMH2OzpeyRi6tEQHuubUopavQdwvECFloB+DR49VLjg9rIxRc/w4tkH4zEyQELC2qoLn/reY2P8OIgRMJDA2t9+GPidncBqOk74W8wmHwW1KPYAsv4dN3/W/v8CuC/zf0/YX4R3KHX/8+/BoLt4BRcZwq3tK3nev3UH4xnKR0mPoEHo0YTpqcbhF5ZmFGfAqSkCp6KHpl4UNuPUd7CmSveFQSZllZLHfezbN07swHyMhXp4AAPpCv9p20DES9wCTa470VPorHPEjE2rGwpkp0X8gSXckKf1L3PWALBiNIqF+5xx/oWxu22+6U22Jz90wI9auC85y03xzcIjTw+Ny/BFqm0w30GKDTzo6QyuKbG72aHpYaVkszdzwKkOxlOUR1AhDgsCxwFT9n4nHVyoEubCvaNmVgYAsoE1gPU5ijWzXU6oDOxU0aa9/TUp4u9srd+fOF16Cv1hNOPS0BjBOLB45sk1nt3XQKdTTVJLUYcAI4lKV9mcgSjmhz08CZAdPYSFTwxAfNN0MS6fvWNdGvmQJH8P9XgSYlKM1b37UTvY1FaHamD9K9ycHUNrB0MA6QYFQHhg1/HokUbS7a75ZgBgjh9JmsopPDVsLwT/yU+hhALCGl9nUrzjluYtk7mKBa+uLDMzdO4tnUp+gIogjU6QBFOWl+2esNqNW1sanBoCAV1bEMUbmjuzsyv9LzfogS+sprXFysheI38LY+0wdktKpovPfD8wgmbSPi1sAKVeT5vW1VUwBo66lXccUz7FRG2E6OIA+BiNR50CPnskKfvUVCnteTPQQ8HjYsSzcDHFs7a/QEa3ZBBcoFk78O4/PS3BPm4RmLAi7shPFrm6s5y4FbDPt3XwFQZ6f+Oh+3eBM/s6X6brMMshiESYBHVEFUQWZfDsuBrPqtZyKHQFgd4eRgWfGKWnH1Km7TiojaFOBjAyNVxeCfiePVMHl97Z6dXWaNmKjbIzi9ubnt5HfNpiqxzv4RsQQJxes2FrQsXsI1SYT8HgHnjOp8xVKLRsqawtfy5C9upq7CxkJkKfPCH48brv0tbpTkRoOjvIqTZGF2RGevF4IYrymRUxbN3t6WfO+7DvwePnPD18gx03k6xuX5Jk+uP8cA0SFgIaAa3Oxq6u2FGEMYjVr20aeqzQWKrXU93TrEWcTkueN2+GMJruKBIvnjr3ansBObKO5eIzh/CBGSxFbGUdiTc99T7CsZDlQRoijk+hWA+hI4cTQYjVmWVMjnlM4NOJflcemDTnkGa1wbwZwejyqvXLIL4I0NVlg/qFNsbhUJ0AS/XDJ3ZiLLhnej6CK5SDKG8sOOHKoatLUxjVocUOog+YGuiMQVo1Iva5pFnm7QjGpjOUnDTx2zUp5zy1OYLvLZOlrhoeSAu0ZQY805QzdghAAEuqp0tde0hS74Lv3sEFHz58GHRKWQn8GXDWcg3MdrF8yRzt04X407vfrv30EkB66ifR1UYC3be3nkGrT1IwdgAIMN6lSM8euj4NkFnhJ9jYBz2V4onSx6ha9NHvPdYMC2Yhknj/ZqRXd8kzGMOGYYX9w+in+0Psqxc4eXBmdDbfvE9AkMCzM5bjnlp97xIPXKynJj7EyISqUCFzfBrXL5UVqZRWPkAIU99NF9O9JAbQumADedP0xIuS3ngyr01nOCMxVeyFz167Gv2i90PIIWFhtCtPQ5eKNU/TEc5CPwQm5Uw5vsuyEEXz8Tx9N4PjlzqxhZxPly4zPMjih8jD5e1hb/HRzpf29EquPvWETQvOeOwlz1N76TN4xjhLL87aWmh5ZAnqirFjypBp5+X6d57FXIQjJHxjTtVzfdsBIXDP+SIQTxw+4GJJUE1fltLgszixhRMfKmnxVshNwQVyGQLI3b71RmXaR/OeqcZH2LQniCHMiZ0tf9rDH2Lmx0+h4FgwtLxnYaQV2vuUOKOZXwCAibPgxz0LFUPo46l1FRy6Mzb2ghgW4lVm0HcbUKWE3eWMLymCJHr03ooQO2KKDeJDGuPrhNQvDOMwM5VKpZqcIfRT3v08jfNU0xqeWQDt5vGvzq5OAc7yp7OrPROcC+v66tr6GDqz9q7OPoGYLoPT+InxND3LpvkpFgxd4xfLn0JX1scr+85lemfQXRxg3gxBfFuwhhjofXJglIljAUJ7NvVhKnNnGBf1Xozv5Gn0PB5OdpQopy4E4aE2k+ybN7nhGXzs22HnDTjXWak4DZ2dnuISDH7uAd2CVx8/fYSYMTi2d3qKuUGgE4bomHr1mJ/gixhegHTbG7nz1EGIHDnoDQ8BBKnsK8RoslQ7EYRdtpw4AiSX1V6exsm18cmTx4dDQ3hoclwzNTU1GONLuWGqDZC02XQsPozmyjFHrk19+gmy6WmaTQi+PgZDV84XwcELXYt21Xuqp9l8tmfk2eSgrYhMTQH7Cc0HwTh8eDyJ826uzcmXynkytdnYFYx744HVc4/VwRRIfdiTGaSnOxJ7oaKXeQqNfNpfxBh7AcI866XrgkMX9O6gWVHnwU9MhtuYQbut5B+TmH+5ByWS3ZwiednNl7o5b1nNl6QUrvU3N5XG3ZfiYORV9Tzfi6tGnVQxMJs9wCu30GLZtgigVYJ22YVDmOWPe/YFn2xF27/TsqGGThn34lGT0efRwSi2eHvXUDYfab5Xnamqci/n7a5b6DM/V/UpvOIwUyxw55nBJIiaH5H5fjeOlsF0f3AsYdFUTWh5ma45hPaWl5FawatlKzbIesynPWopQH9SfRoMWgm8M+jeCar12uWP5zt+48nzAyPUM+dcrpg5QgpNKfmfS3pv3cJde+IvhHjgJ1Q3xv2hYNzlhxIZfMPz7FQ6GdSPoSAQ69q6ilmgKM5Afy6fgt4EA7cH+nMM7MWVedUnoQXmYgx0UOxjInhtnQWD1+ZZzNzDmfgY+kTvhFjP5tQnFsNhHrOhDA5Qzx8bwuE9Dv/yJy0pXPC9tSdn/RDzpfcnh8YdKJzbc8PYVYdDBZ2Newpv3j7tzalvin1aXv6IZPy4vPwJQCH5loGwwSv8AtVmLNbXSUg/sB/Le/jF6fLyaQw0jHvn9bJNSMd1e45+BU+NDKeSiLoLpLkFFXNnHJ7cGyca6a0fumvABcwZP5QCm5ts5otxmxpNSKjltGWCu/R2xEQxjh4N2dqDroPZfOZ+Ol/suSS0hTQ4eMfgnWPOnVdDCW6nu7dv3xdMK11X2ZHhgZ9yMsNubgZKuH4mFAbWgJ11fFIGRXpR32yk09XN4sNR9km4RxS1OJOEgPTNsHlkekVqI+px+LPPpKfB5y8c/gMl4bAiBeKZnmSprCpPB5c9eihuVtPpBgze4B7B4PfW8d1aDDUjHDUi9suk1Oru0DPq7sttdJVvpM3m4LRSl4Y5C107jvS1U3cRc7Rj6NR2qIPmCMKg+7nn3Hm2594Z7NX3DVnApplu8O47s4hcH4K425BpFVt8qnp0nuEHajHcehq9dH+xiSlVfE/FVHkQIWETRcl9FRNRpLxnKLFH5zp45hQbWtQNBWAmNQTBM4+95tjXpM6Fex5bbV6Zzh8SlmMLzTP4MJlhNQPxW17qEU+Wiomh/TNyfSrH0NcQzExd3IP569fT9GqiUj+/38TlaaxqLWbJoLVQIIZsqCqv0KZLKWvQc6Nj+RQ6PQVJGlveuwZVGQp9XB7zXMPntRkEBQmSdd1DaIXwgj0rlNiDT9Cy7p1noHDxzuBy8AmPgk+aknR7ALyqNpLOG03cEbJZFLmzK3xTyvsT4izj6+ZgXZucLaFujYX2rvHPpaGFHQ+4n7lamraZhqKbg+zjWIw9a3nZug4CNeETEyafrGXrUwyIYkHkNOClgC++bJ2Crjm1lhNgTpw7Q3Bngt7pWopBYTBVvTpjD6CW88B4BhNDOj1q93oviMWsfAkPuerXtfVrE4nEgp6D54NbBa7+P4YW2AqoxewGjmV8MJlhRxcMEMQpK4FnUPUYDMWcz7FgT9FQaxF0v4jRO4Ijd9IKVM9woFRNgovqjAA0eiE9YPDJP6zTq2uPB+cmYRI7tdmvTezVl9LtweYV8NMZDC32bmLgESlmKKB4bw7qAMdk7D2zcNprIauP8LlKlCcltsOG4j0m3QbDjCESTryD8ULgck2LzOhZeoP1pW6NMCky1t4eY4augdzM9dggQnCBmiN2cCg7XHAY1R2jUwIVPHN+v4oFewBRZoNuMYpb3XY1UJ0SOn0C8G1zOKn4tjkkhRPvxmDQQBlgv709E1/JM1gj7NZ5gzoBgd8DAlpMgrmKfRhSp4o5moEaBmz7NmOucY85wYSToLBiZ32EHmYs6HrcTsFY6FOvfDE4tvyMqR9p780hk0g+wPMToMKQ/UIx3P8DWjTt1nm7tfoT7z6GPn7aQ5/q48erYRLSI4pe6dFZVWRM6oGfWVfoeoZi8HmGGYvTvdDpIELQCNYVfBFcPgMHDS7Y+7T3yXaBQteeobXs5xs9MG+YiFcfPwbBuT/7BCg+kOFafWe/BfkQxLU3LLmDPj9MjCSx+ZfiCwfie3tknyBmh8DhzPr08RNGGuCVnlqghKxBhCaoGvoFaN5T/ARzsYeuN9YoMsNr2c909cZTHXK7YaQTH6irh2WEy8HgBzK83yKHAVRawcx+7ON1MDYW+8AqEV4amSeg9OsTazplDDE7Yrq2I6nY2RnM2CCT2pWLmNWhkRO9ALkT8H2yF+vNr7BLgx8aGVuU+IjCfoiBZbr+GKMZ/aE9MxAJ2/ue2CCIz7sP72IpPb+bLvxcHokv7EzeQHvStY3xE8bwQ9VNQWsIISZ1Br53/O3rZef+J2nSwVbwJFPDb+ghxZ8L6d28korB2GHGguzovqfe3jV2IpWa4CdSsbGUdHF3d1sc5gWWRLJxE6xSs2li84wouN76N9icj2fBPgZHeQxBHCjKwVTi2Nmp6dzbHBGGt++bHtofduwx49nRlTwle3t0/BhJjcVSEypCYJ/sXavxkvt2nolynH83FnsXKRjG0Ul1dD2f8Hqxms83yiwvyeVSwvNkNO44GXP5I/BpCP2yPXMUoE3pMfw2NHZ1/ZEuPHtG17LtJ3oSpbIs8Wy5kc9Xi8ro8j0rV0+ODKMQeRcb+8DH61RBju4/NPHgFrrRWd18vIikYiCIJ8b5STI9QkTESGT7Vc1E5iObQ+vC7oy7g8VmWZbJME8B2heAs+a8ed3+wxOuQHe0sRmhL+7s9TzSlHTyxGucoBimIhfvN1FGR/eQ9vYBy8nHh+PMlPZOqp2fJ7TNyEtrghBGKdmZWjw981T7gKg03UF7+j+AkDIFlFT7P4z7be86T7PwJIfwtmDOpOO1mazSC5qejiWyyTbPz2vSO3kqc/zwmJSf7gPu7eVWMRN1VMinIGK+iOST6ScPrKcklZf4ej4JYkh9VM8zngC4dc3B18NjFrHwBv4H/3/bpP9hhr9uoq/59EHvbV+06YHAtw79qlK9PgqwXkvmAw/GbTmVL+CR7bgTAQJfZWgvt7sfn6R2OcMw7r5Y3P0Mzz6eP47mMtiEmcslqJKhI3qiUPsg0VNv2q1QsCEy/f+AX43fovoovH/1MfS/bwClmcjlzOQT1bArPrL8zD1nfcGqRA6LF57uxwc2pWcqkNTl4c8nl17j3Lj/KbJZMI7zIw8kCl22eGlAT8dnt/fUjFOvx/3J85LRefFZ8J9mYjRBI+ePjeRmZOYexsxdnpwc3QbIM2cq9M/FYKpTm8U4ph1va/Bx91SbEus5c/W18dGAHcSziTJaMJlXUtkvP/ZtIfHklVJYGHsUr12ieMXLU1N55vlzMUzePttErkrFGX6qgGdK4pnLl9knL+EagYh6BVjtNS/rjZv+x2toFPYkx/TMHe+RhYfLTAqJp++rkxuXeEY1DrgwpZTqkr1wmFb4IUHvn08jsxfpCCDE3OPD7b1RGOUKhJho9tYowRrH841qxjJfc1qdZA6oUUBWoPUbz2d6e9e/Ma1MtZGPmz37/xZLQp6xFY/uUI3kVKR2IcvPn0/TO2MI2PrLT5kj42GGnZpiSyeX9WfUMzh5tqYpeBJ5mdf5KTkb/1o0YNtz6MpZFH8NIfh/8aw8BU+W8wmaicapnJGeDAXzpCclAkOdOTEuM6UvR5g1TD53xpB7TpTcODKOz42L+lQ2XatOla3n3mNIlNRMDtyoRLoY0VmiVnMM6vTXADrpfxhn015RfX1C0EIwuSr4Z3qkmE5AX7kZ9qn7QRkqFcnX0llMk97fG4cN+YVzonpnfRFMGR9Wp6icmvWI+sRLog/WeVVWaXJPLSbM0Uz4i0Q04UKnBPfVCXFSJQl8IyhRJFWW1Gffh0l4PlKnrkttqooroxcvn/UFygc1EJGzF3fGxVTJ5qhEKRlvvPCuTbsqU0/3Yzm0gM8a7je9LIDHcouonkX49g3NM/We50nbxZ0v+FZ6I57MY4gEYy1NXRh3F0WZ6Hhem/LMacKUsODXyOMnRnwTrCVE26eA0fL844XnE14tpj09ecJKjXQadMPz1HGLUlyv9LmrQC3H0+lcf53rbdOTLj7PRjiAfzAW4DtlrsfAa9mMGw/j8stn7vXPTeRr57Up+ANENR8x7XE19nwHpJwbqBqE+Y6nIlONpIUInzORb5uDHvgIQvuGQtNKNqYiqXiPL1CbMbnyCxDHrkKhM4ZmLxhzqnaOFv3lcxOdsy/xoKGCBTTEVG4iEbo+DcVSzz+fkB6Hgio3qxGZJD3IpRAnmg4phwsNeiaqp2mc7wt4A9wHwufBt+FWTccg4R/SL7z3k6RiodNrrLYMXn1iEptWAfSCfQrt80cJ988vVVKRDPPpI2ZxY6fMVex5gNDUMnAUeN4QMdWIDr6Avc2tac6Uq2BQKFTbGShQQGjGQetiETW1FuigIzD4aBQzdiT2tmkReFYc73/zHji//NQkOy0Vu2JOrzA5+fETk4nQY1JeO7+0fwatnRvG9QUGM1PB0aTUwDRKxXTOSiRnUnzP2cEabNBUWFhX8GQaVes95dDm2x430siC7tu0qo0MSh1WIkUUu0IXQkIwUWpqJpmwcunii7W5hJ0IBj/BCGNB6mPTkb96Bu3AOcI6Y13Z9dAQpgdfe8EoripCPAX048suwJyqN9A5Ay+LVWQFd/e9Hcq+UIQm/rWuyDxr38cUZTXnQizzQEdekp5ZKex1jGtHIIHXWLixF7oyTYn92jnCvbOgSRFvCeFCX3DsgxKZKjVfwUibnMrYMglMphOepo/fWwrNBaAHygyus9D6BvyVygQhztUS0R02f+/JpL72Vlp5tzQVUT5gju6TGUKCpL56FjSit8/zTi1fXzHLWHIXA8V7UfhylI282h1pWAx1rgpMUidSmgqZx1GBQMPCoK/tmEaAZWeu5Sz65G+bGZ7oSbsKqsBYjdfnNNI4+lK4wAQbLqbmmNj1cvTr53k7Z7Ir7MS74NiySesIPkyoSe/94W3z9SpnEilmIDC24lkJCzdQnzr1Llg05vhs7q46j+OYuvvp+TxmtN6Cu8xK2bgFoW6m/GICxe6Obd4e3YtJdeJDLIjlz5+CmKTHM9lTr76DrX+u/thYKIT7z8ZiQR1cVeFi5iWb1OtUUTG/QfX1e9SOdrkyq9QKbu2UDdH9xXrb232mNEDlvnmPyoJgruIV8XM6K2cuBOMwK4/FxibYd3RJjv2Wc/V770Yg7Ltg8INCJsbGYiwgfNSmfOpXenU7z8aTlpUsOS/nBq3VKyyyk9k9twbgms5DZbmUBJUcL35jH6pvk70wjhrIoxNE/xCke/tQxuSvvIil/36LiYkJvZqW3sViSkY8bBSbJ4WvUdHtngft6qbGnB2oTN+R6VeKDZbAEl2F9pJ7NtpDuXDSLFfvwIeJxd5J6YY+gbutMC7M6195v8XAO0pYMlV4KEcUdurROPHrJSDkc+HL15qEZHOriO095oN+m/VMzPfVpgD5Sop2YjxOsUqkfPJ+yo4C8B0lzwQVI633nhmSSpvcSTwz89MX4yGipG6fVhF9Q9Pz5tt+FbHj8vR/e2vmX4hcXmkkdWncArQH48tPM5nkCWemMU7/xvfM9N8VpNTuDM4Qzs+P74y7eCN3btz+xH+9+5EmWYOY7NTq+0G81os+2cvPnLk0znON+LFxdHzOCZiDyujf/q6g/vue+PQXQzg6OsYd7OdHWBN22fjel8PbBzK4ZahOLcDbAZ4dOPjhm5+Zv8S6rqNz3Jl+fHQnGCdp9Tve99R/ZxfRbg+T1UbpkcMjzx8KhYu7Z/JSrzeV7s5wazQdk++aC/rr+ycZ0K8+s3B3USg84KHx3ONPjWry7kvAeWeX/E3v7AJj4bx3TQG/KJXiy8ATjw2fJEmNzHcKDaHeSg/h4L7+vt55J1twrgAADFBJREFUWkH3elPSDRhLoAoG8bLOp1JTM031u9671n93nlxlFbMo1S+NpkaVv6yz5Gu2eGQwhUGiFYYROm72Mwtcr8wZXEy3mYHf/QgIpayppIDRdRix+q3vzuu//1CWG4ePpYJwW+4dA1OOfw9EJY6FRj1IhUG/lCLE0p/ad+gvEu2vW8jlW6FZejxsyPL3vv8Q+FSx32FJipfGPWcUekYL/KKZ1z3GoSbnmSZWazoI3VWqPsKC2WS+Q9WQqeTAbjXp0RDujVssnvnOd1gOvIdUbYqG4e3xEQS5jFmrf7s0KtWS1WdLN3p63+fSRKnx7UxKyuBy9ksS+ZrXMPCMku9/D2n/XbKEzZ3c9xAiQEy1ZL8doqwyrsVn+scW9C2+J/IdxkJPY/+91Rkl7b07yeHa8Pe/SxbfB0znBXxc/6PxKA0AzFUt5plU/wuNnt9j12cyAzlCxokXB3cufUNTIPQDiI4qAC599IPr/oveBzzwTmdSfvg5S3oAkxGpxHy7+iN1REhza4OVhu9pSIwIvxmdjYpP9KhIsj8/YDDwy97pPPhebjmVL9NsRMKeP5jHnPrsIsJzDbnUgTPYKGjQsuY3et5EsWN+5EjgI5oeKeYR9i99L/fQu9VpJYSOAC2JnwLnIa7Wa9+4s5mP24v2Iwsx9Eym5tuBLZKvA5zKxanvA5oBU5E5PBmRbkj45e9WxygDHFS3RE6hLGrq8TQCbchTZnLqm6I5UmewxubJWho9Hu09821iKBfxvX+AiZdlKWVDdL8BpaF8Q0TxXLPAksLD6JlYJEk3ZdUj9LMmIQebta9yKq8qRC4mGM9zdY3I80WZKOpXyUiKFJTEymnoHHUgKGZ6XIlch2kHz+Q7tYzbcio+zGSJ3QdmG+lnmleq2AdondcpQOKJjEqwtjPxDA0TWB9J+Ewi/pWnSBCF16C7ND0hCOKeLOJF6pOoiWqUVuT/ohaPYOqRniWA3gSVSb4YVWRaIM7mmNfzKgrd7KBMAZRyrjm0VPP2bTMHD0lM0T0SrzEDkcomqG6VCkc8Y1GkeSaDYT1hUYz071ej/ZaOYM2GDbFu2TJD6CuiPUxVQh/itcnnk1YGmAhNWHWqhgVGTgSMC7w1GCZwAbBfxkq+zKd8FhmwTgtI4FPikVyRak53AWaVSPpVDF9pGQl1lQ1Rd7VCBE9bSm+ySoJ5ZWxosKqbqMTRuBc3y5l4jbHjpVp8pr6Ztd0AprRZfTl+gojWtGgvVDAsQtC7llO8C7ChSDO/BiD0L/EUosz2FmLVEhXCtCQrZVyvkCLqC54XkfrTaxVVJVICu19gqhFezfZ1Q+a1NCUweITQaZRqVPL5jL0+xspRBMhLv8AQPgfR7J8yCKYH5r6cZXJFmFE+VTOZXPaFQap4kONMwkrGTQZtO5+N5+JYtarC7/GkBX43mIGXg3yITSD0cN1QlI2ZzYx9MLWMy/cA8Lvc7Zcgoix63GpahVrcEq9mGIj4VcoiJhL0uRHySYbouiTxUt2eecLbOVFACDIlqbpOXuB0BftTqHfh/IUUcWoTzAz+QSl6UAZ/PQUdiLiYY9dWK3E0RrkI0VVw5QAmdFrFVf+q/AxGIpdsGdNL5pCwyQ2PXTFHsqVn6lnASKbjil1WYTsFhAfDguJh0cNbaBV+8TcCyEDMS89EzdN3I6aSHlo8VcqqqAcAYB4rxpg8m2efjpW4kQ54I0NfyK5DRJ5ZtyP1dJwueMqoXjCRRrKJZAo94gZllkienhcb+ZVKpt/SEMRZ6N8Sap9g9lSCaUfZpMKPC/oZXU0y2RT7jYsbrzcZFRR6GmAjUOYJiy/gSqp6ku5upgoMlN+vMxPDLQ56E/y1JPV19QZj5ZPoDyDXmLQiWtFZe3Nmsvxdqaon2GxK0yejjVJpPCgR0oCepCjdMijLOBRF/p6kxddbDjxenLgylf+ivW5Ow1F3Ex/qAXpptfjL6ajk7SQ/nkwGyGRia5f0FLpUTsZKKVN2kvVf7Ko936yUThWzLYxqoxZv0LeYm24hAZ7JaBKkNGNmdfC4vw8m2B2Funk0uAaENF+hEluXpetV2z+2RZDJS3rqFzrbr7Qsr6C+idN1QVnhaRknPasApx2CJA+T4WV0irOg4jL1Oi2v/zZ0rF6uxz1l3OBp0qdlmXTaDgNdYUvSZ8moy82ywv+iePBrrRShEmAVXQOFKjQrkxJu91NwQLQuE9c86J6xFCF1WdVfRwmkU8opugU0HgEd1qBirdaZ5Cb62kmVVbO1hBVvUF5RUT6Sshz5jazEaIuDdOOjM07QRI9HUaY8GBvgBhywzSrI4oyOh4Xjb3wil5ipZxU+Iin9EwJsyFiWihokXrJAWSKlrKkqKma0orUck9ikPkxSIjIvSXaaW8K1wZIk8/HfByCMoa5QOcdyF0rEPGNlZ3CPpjIDoykSar+APZG6CQld9ES0yCSSjDWTtXUISUHQieu1pSTo46xMiSLh8i3cmKdv62V1PG2PMXPUNU8UHYef8JgtBV2n1H97Eey3vCTjsg2IHyUJ36Cd5XXwwpA7QbkjMttSExBKJkoimMXFq9CpkWfgZzwoj6BMgy3HkzloqQ+q5bi1iU48lpxjJUMD4ysm56z008XdNC//Fp7oay0O7hrGBVaDsqqsVtO1hqrgWOjpyx5kUmgYE8LoQUSxoryBThZNsmI4PINqXwW9meRtawDfqDl0by0rlwfWLcc3TUaWZLh4pmqvuEu006yKBW+/c8PT9+hulHjKLvdRFDmVQruhENxPZQPBDbjpEvV3EHWWL5fo6g79jZ7uhE51gm6+8uDKBfVAc8gRmIbGFxZHCSvXqtRJgwgGcaUVXWp88+LLr2hxGbxu5LuMYvuUdhIH7AaaD2RSQnWqZY8SJSxKFNvVUaiIoWXDQlePxDMJi9pA6jBUN2ccPxQQxlGe7XU0vItJlFVd/sb1wV/bTJjZSB7Jludt9cEX87h3Co0hHn1TLkooiFRv6MjAU/V82Q5jLTzXATcCUuRslSklMeVF67WYOE/TB1kFrGsy7lS16qrdVQSrTv81AKElU7xOkFWtqmRjVMqlaNWisQ5Wz8VREOlRxlSt4uo6kgZgxdOUEW2ilZNMNE0ZnCopU6GOg9lI5TO67Q3qUhVZNw1MkPqGIoTfsGVU3RYOKx+xVxFkUkzmGHMKj2uwslOW7ZPTkSdVFB+QNnDtqlU75KMSWWJyNCFVtt/JyBRtdzrJyvYz9QjFF6/zuvTVOpnfugGr6lKZuqElR8gIP1W1SjogTG8W7coq+mYt8AjUEuIkUYbh64zzvky6waSqlFEN02IRoDo4tknF2SYKZMNjkiFcgZ7+hQzab4lsRJeKiNGTTjlZDBmYFgODOC7t2H+hBgQcTdsvqPGuOpLo9i4IoxncpsuSCM2GyLybrldTGYqvCPiyrxbj/Y6N9k7Pa2aSjf7ZMUqxZuWcDeVU3PK0nC6J21azhK/ZbCmh3wlaFD08SyfyjAV6yw3FFKkRx8fGkX7Ff60APsUIk0339GZSkruTlVfdBCNNVTWkqZx90oiFO6sQGY9ZKjQjLNZ9gOQh+Z27dSmVQfHDc7T/YHzYckA8nqcbV5hcqQfSaQDHBARoEtISbnHk6XuYMPBQqA5JydVaYyrSW8ZCeCX7KKc8zytS9o/Ghy2RV2AoxTTVBblSWRp44RerK4pajVu5dFaVc+CVEaKn8UDxmlRKgn0BbpWVXimLrEh1G56ZLkZ6E/dv0MxMHQip2KLDWOmGLikDqTVZcYp+UwS97xTIlqxg+EQGpgLQyY20826DqqIokq1p/m1asgo8pSrVuJ2syWUarMqPbJ8nTmhIhndqEVkHBdrI2HkXD8BTFV6t/juw53Aza1kVTJmUTTusZcVnGild4hUE+kxSFE8QgOuVVGMm7kR8FjAzPAQ3jP1xQF5rMEAAxEupqouSMRPxTL5RTskRCaucQbZ4PKpLlSJ6qtzIZ+IJlxWtWjVF786mf88I91c3M14lEjIssF18cKSmlUsm4/FarRaPJ5M5a/BAAitJmZrnJdCs/1bC90JLZBoyRSkpxUEqPW1A4XQ+K0sgeLwqu6L436Ml0vkyyCA2NULK2WppJpOm5ENCpjMzpWq2TCIqUo6X9HI+/e9iGL6neXK1UqOsRyiKZxtQudwo1XL/HTjzlWbl4ulMvtooluspfI9HNFUvFxvVfCYdz/0LdMr/Dz+OtO2Oi6QsAAAAAElFTkSuQmCC'

const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: import.meta.env.VITE_OPENROUTER_API_KEY,
  dangerouslyAllowBrowser: true,
});

export default function App() {
  const [messages, setMessages] = useState([
    { role: 'system', content: 'Вы помощник, обладающий знаниями о Конституции Кыргызской Республики. Если вопрос не относится к Конституции, сообщите, что вы можете отвечать только на вопросы, связанные с Конституцией Кыргызской Республики.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Colors based on Kyrgyzstan flag
  const colors = {
    red: '#E8112D',
    darkRed: '#C00000',
    gold: '#FFD700',
    lightGold: '#FFF9DB',
  };

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await openai.chat.completions.create({
        model: 'deepseek/deepseek-r1:free',
        messages: [...messages, userMessage],
      });

      const assistantMessage = response.choices[0].message;
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('API Error:', error);
      setMessages(prev => [...prev, { role: 'assistant', content: 'Произошла ошибка при подключении к API.' }]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([messages[0]]); // Keep only system message
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const [theme, setTheme] = useState('light'); // Добавлено состояние темы

// Функция переключения темы
  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
      <div className={`min-h-screen flex flex-col ${theme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-gradient-to-b from-gray-50 to-gray-100'}`}>
        {/* Header */}
        <header
            className={`p-4 shadow-lg relative ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}
            style={{ borderBottom: `4px solid ${colors.red}` }}
        >
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="relative w-16 h-16 mr-4">
                <div className={`rounded-full flex items-center justify-center`}>
                  <img src={gerb} className='rounded-full'/>
                </div>
              </div>
              <div>
                <h1 className={`text-2xl md:text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'} tracking-tight`}>
                  Конституция Кыргызской Республики
                </h1>
                <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>Официальный конституционный помощник</p>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                  onClick={clearChat}
                  className={`flex items-center px-4 py-2 rounded-lg transition-all shadow-sm ${
                      theme === 'dark'
                          ? 'bg-gray-700 text-red-300 hover:bg-gray-600'
                          : 'bg-white border border-red-200 text-red-700 hover:bg-red-50'
                  }`}
              >

                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Очистить чат
              </button>

              <button
                  onClick={toggleTheme}
                  className={`flex items-center px-4 py-2 rounded-lg ${
                      theme === 'dark'
                          ? 'bg-yellow-500 text-gray-900 hover:bg-yellow-400'
                          : 'bg-gray-800 text-white hover:bg-gray-700'
                  } transition-all shadow-sm`}
              >
                {theme === 'dark' ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                    </svg>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1.5" viewBox="0 0 20 20" fill="CurrentColor">
                      <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                    </svg>
                )}
                {theme === 'dark' ? 'Светлая тема' : 'Темная тема'}
              </button>

            </div>
          </div>
        </header>

        <main className={`flex-1 overflow-y-auto p-4 md:p-6 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gradient-to-b from-gray-50 to-gray-100'}`}>
          <div className="max-w-4xl mx-auto">
            <AnimatePresence initial={false}>
              {messages.filter(m => m.role !== 'system').map((msg, idx) => (
                  <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3 }}
                      className={`mb-4 p-5 rounded-2xl shadow-sm whitespace-pre-wrap border-l-[6px] relative overflow-hidden ${
                          msg.role === 'user'
                              ? theme === 'dark'
                                  ? 'bg-gray-800 border-blue-400'
                                  : 'bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-500'
                              : theme === 'dark'
                                  ? 'bg-gray-800 border-red-400'
                                  : 'bg-white border-red-500 shadow-md'
                      }`}
                  >
                    <div className={`absolute top-0 left-0 w-1 h-full ${
                        msg.role === 'user'
                            ? theme === 'dark' ? 'bg-blue-400' : 'bg-blue-500'
                            : theme === 'dark' ? 'bg-red-400' : 'bg-red-500'
                    }`}></div>

                    <div className="flex items-center mb-3">
                      <div className={`w-8 h-8 rounded-full mr-3 flex items-center justify-center ${
                          msg.role === 'user'
                              ? theme === 'dark' ? 'bg-blue-900/50' : 'bg-blue-100'
                              : theme === 'dark' ? 'bg-red-900/50' : 'bg-red-100'
                      }`}>
                        {msg.role === 'user' ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${theme === 'dark' ? 'text-blue-300' : 'text-blue-600'}`} viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${theme === 'dark' ? 'text-red-300' : 'text-red-600'}`} viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z" clipRule="evenodd" />
                            </svg>
                        )}
                      </div>
                      <div>
                  <span className={`block font-bold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
                    {msg.role === 'user' ? 'Ваш вопрос' : 'Конституционный ответ'}
                  </span>
                        <span className={`block text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                    {msg.role === 'user' ? 'Пользователь' : 'Официальный помощник'}
                  </span>
                      </div>
                    </div>
                    <p className={theme === 'dark' ? 'text-gray-200 pl-11' : 'text-gray-800 pl-11'}>{msg.content}</p>
                  </motion.div>
              ))}

              {/* Loading indicator */}
              {loading && (
                  <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className={`mb-4 p-5 rounded-2xl shadow-sm border-l-[6px] relative overflow-hidden ${
                          theme === 'dark'
                              ? 'bg-gradient-to-r from-yellow-900/30 to-amber-900/30 border-yellow-400'
                              : 'bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-500'
                      }`}
                  >
                    <div className="absolute top-0 left-0 w-1 h-full bg-yellow-500"></div>

                    <div className="flex items-center">
                      <div className={`w-8 h-8 rounded-full mr-3 flex items-center justify-center ${
                          theme === 'dark' ? 'bg-yellow-800/50' : 'bg-yellow-100'
                      }`}>
                        <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${theme === 'dark' ? 'text-yellow-300' : 'text-yellow-600'}`} viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div>
                  <span className={`block font-bold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
                    Обработка запроса
                  </span>
                        <span className={`block text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                    Конституционный помощник
                  </span>
                      </div>
                    </div>

                    <div className={`flex items-center mt-3 pl-11 ${theme === 'dark' ? 'text-yellow-200' : 'text-gray-700'}`}>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Поиск информации в Конституции...
                    </div>
                  </motion.div>
              )}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>
        </main>

        {/* Input area */}
        <footer className={`p-4 border-t-4 ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white'}`} style={{ borderTopColor: colors.red }}>
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-3">
              <div
                  className={`flex-1 rounded-xl border p-1 transition-all duration-300 ${
                      theme === 'dark' ? 'border-gray-600' : 'border-gray-200'
                  }`}
                  style={{
                    background: theme === 'dark'
                        ? 'linear-gradient(145deg, #1f2937, #111827)'
                        : 'linear-gradient(145deg, #ffffff, #f9f9f9)',
                    boxShadow: theme === 'dark'
                        ? '0 4px 6px -1px rgba(0, 0, 0, 0.2), 0 2px 4px -1px rgba(0, 0, 0, 0.1)'
                        : '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)'
                  }}
              >
            <textarea
                className={`w-full bg-transparent border-none focus:ring-0 resize-none py-3 px-4 ${
                    theme === 'dark'
                        ? 'text-gray-200 placeholder-gray-400'
                        : 'text-gray-800 placeholder-gray-500'
                }`}
                rows={2}
                placeholder="Введите ваш вопрос о Конституции Кыргызской Республики..."
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={loading}
                style={{ minHeight: '60px' }}
            />
              </div>
              <button
                  onClick={sendMessage}
                  disabled={loading || !input.trim()}
                  className={`
              flex items-center justify-center px-6 py-3 rounded-xl font-bold text-white
              transition-all shadow-lg transform hover:scale-[1.02] focus:scale-[0.98]
              ${loading || !input.trim()
                      ? 'bg-gray-500 cursor-not-allowed'
                      : 'hover:opacity-90 active:opacity-100'}
            `}
                  style={{
                    background: loading || !input.trim()
                        ? (theme === 'dark' ? '#4B5563' : '#9CA3AF')
                        : `linear-gradient(135deg, ${colors.red} 0%, ${colors.darkRed} 100%)`,
                    boxShadow: loading || !input.trim()
                        ? 'none'
                        : `0 4px 6px rgba(232, 17, 45, 0.3)`
                  }}
              >
                {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Обработка...
                    </>
                ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
                      </svg>
                      Отправить
                    </>
                )}
              </button>
            </div>

            <div className="mt-4 text-center">
              <p className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Официальный конституционный помощник • Версия 1.0
              </p>
              <div className="mt-2 flex justify-center space-x-4">
                <span className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>© {new Date().getFullYear()} Кыргызская Республика</span>
                <span className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>Все права защищены</span>
              </div>
            </div>
          </div>
        </footer>
      </div>
  );}