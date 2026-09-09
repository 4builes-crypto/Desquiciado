# Respaldo de los registros DNS de Zoho Mail

Dominio: desquiciado-sas.com (Vercel, nameservers ns1/ns2.vercel-dns.com)
Creados el 12 de agosto de 2026. Copiados el 9 de septiembre de 2026 antes de
eliminarlos para pasar el correo a Google.

Valores tomados del panel de Vercel y verificados con una consulta DNS publica
(dig), asi que son los que estaban realmente propagados.

| Name | Tipo | Valor | TTL | Prioridad |
|---|---|---|---|---|
| (vacio) | MX | mx.zoho.com. | 60 | 10 |
| (vacio) | MX | mx2.zoho.com. | 60 | 20 |
| (vacio) | MX | mx3.zoho.com. | 60 | 50 |
| (vacio) | TXT | v=spf1 include:zohomail.com ~all | 60 | |
| (vacio) | TXT | zoho-verification=zb43265607.zmverify.zoho.com | 60 | |
| zmail._domainkey | TXT | (ver abajo, es largo) | 60 | |

## DKIM completo (zmail._domainkey)

v=DKIM1; k=rsa; p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCRQjxtQ3+01N5tO6uKxswqdL5goeawlb0CJJMRM0ZVkGhTSL38DDKOXzv1R3skcvc5TTi0K2qyx0e9Y2cWZKKHIGAEGfphEwfj9sAOinw8mZY4Tl1MZmTeVysbljatK7drr2tD225vh2apuaEwgbiOQCw/th6Gk5fci8MvhMbwxwIDAQAB

## Lo que NO se toca

Estos son de Vercel, no del correo:

| Name | Tipo | Valor |
|---|---|---|
| (vacio) | ALIAS | cname.vercel-dns-017.com. |
| (vacio) | ALIAS | 6050620f9d771448.vercel-dns-017.com |
| (vacio) | CAA | 0 issue "pki.goog" |
| (vacio) | CAA | 0 issue "sectigo.com" |
| (vacio) | CAA | 0 issue "letsencrypt.org" |
