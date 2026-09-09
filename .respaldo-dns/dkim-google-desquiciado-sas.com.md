# DKIM de Google Workspace para desquiciado-sas.com

Generado el 9 de septiembre de 2026 desde la consola de administrador:
Aplicaciones > Google Workspace > Configuracion de Gmail > Autenticar correo electronico.
Clave de 2048 bits, selector "google".

| Campo | Valor |
|---|---|
| Name | `google._domainkey` |
| Tipo | TXT |
| TTL | 60 |

## Valor

v=DKIM1; k=rsa; p=MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA0ryfUf+dF/0KyUY9upXgjV94Od2/tXCCApgzSMG+M473GM5xZJQl2Vz68f7iNHMoFMvLF54lMcTylPxSWk0gxx5Pehl4YJzIgNljvbqX2+8sApu+hUytn9X+8z9+D9OzIB5lEbLtT6ddrdbD97TV7Os61FQhIY50N9OchG9UnmyA66q91R8TVn6pwBYpBoBf2ocIPfe8V65WJs8Vq1crr4DmFhqeA/rFap7ntmX0sfPVcSdyvZWDbpZcMGoBzvihOLrmlasoYmV2bxI7RvQIPgVPDi67UOUEKaSkaWR5roTzrQki5lqdvHijQ7eRfqEhIPSmXJs999sIfrC2tTyuRwIDAQAB

## Como se activa

1. Publicar el TXT de arriba en el DNS (Vercel).
2. Volver a la consola y darle a "Iniciar la autenticacion".

Si algun dia hay que regenerarlo, el boton es "Generar nuevo registro", y hay que
volver a publicar el valor nuevo antes de reiniciar la autenticacion.
