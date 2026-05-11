'use client'

import Link from 'next/link'
import Navbar from '@/components/Navbar'

export default function PrivacyPolicy() {
  return (
    <>
      <div className="page-wrap" style={{ paddingTop: 24 }}>

        <header style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28, paddingBottom: 16, borderBottom: '1px solid var(--border)' }}>
          <Link href="/" style={{ color: 'var(--muted)', fontSize: 20, textDecoration: 'none' }}>←</Link>
          <h1 style={{ fontWeight: 900, fontSize: 20, margin: 0, letterSpacing: '-0.03em' }}>
            Política de Privacidad
          </h1>
        </header>

        <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 24 }}>
          Última actualización: mayo de 2026
        </div>

        {[
          {
            title: '1. Responsable del tratamiento',
            content: `El responsable del tratamiento de los datos personales recogidos a través de la aplicación TeamUp es Carlos Olivas, con correo electrónico de contacto colivasbon@gmail.com.\n\nPuede ejercer sus derechos o formular cualquier consulta relativa al tratamiento de sus datos dirigiéndose a dicha dirección de correo electrónico.`,
          },
          {
            title: '2. Datos que recogemos',
            content: `TeamUp recoge los siguientes datos personales:\n\n— Datos de identificación: nombre, nombre de usuario y dirección de correo electrónico, proporcionados durante el registro o a través del inicio de sesión con Google.\n— Datos del perfil: fotografía de perfil, ciudad de residencia, deportes de interés, nivel de karma, biografía y configuración de banner, aportados voluntariamente por el usuario.\n— Datos de actividad: eventos creados y a los que el usuario se ha unido, momentos publicados (textos e imágenes), comentarios, valoraciones de karma y mensajes de chat en eventos.\n— Datos técnicos: dirección IP, tipo de dispositivo y navegador, recogidos de forma automática con fines de seguridad y funcionamiento del servicio.`,
          },
          {
            title: '3. Finalidad del tratamiento',
            content: `Los datos personales se tratan para las siguientes finalidades:\n\n— Gestión del registro y la autenticación de usuarios.\n— Prestación del servicio: permitir la creación y participación en eventos y torneos deportivos, la publicación de momentos y la comunicación entre usuarios.\n— Mejora del servicio y corrección de errores técnicos.\n— Envío de comunicaciones relacionadas con la actividad del usuario dentro de la plataforma (notificaciones de eventos, mensajes de chat, respuestas a comentarios), siempre que el usuario no haya revocado su consentimiento.\n— Envío de comunicaciones comerciales o promocionales, únicamente si el usuario ha otorgado su consentimiento expreso en el momento del registro.`,
          },
          {
            title: '4. Base jurídica del tratamiento',
            content: `El tratamiento de los datos se basa en las siguientes bases jurídicas:\n\n— Ejecución de un contrato: el tratamiento es necesario para la prestación del servicio solicitado por el usuario al registrarse en TeamUp.\n— Consentimiento: para el envío de comunicaciones comerciales y para el uso de cookies no técnicas, cuando el usuario haya prestado su consentimiento de forma expresa e inequívoca.\n— Interés legítimo: para el tratamiento de datos técnicos con fines de seguridad y mantenimiento del servicio.`,
          },
          {
            title: '5. Conservación de los datos',
            content: `Los datos personales se conservarán mientras el usuario mantenga una cuenta activa en TeamUp. Una vez que el usuario solicite la eliminación de su cuenta, los datos serán suprimidos en un plazo máximo de 30 días, salvo aquellos que deban conservarse por obligación legal.`,
          },
          {
            title: '6. Comunicación de datos a terceros',
            content: `Los datos personales no se ceden a terceros, salvo en los siguientes casos:\n\n— Supabase (supabase.com): proveedor de base de datos y autenticación, que actúa como encargado del tratamiento bajo contrato de protección de datos. Los servidores se encuentran en la Unión Europea.\n— Google LLC: en caso de que el usuario haya elegido iniciar sesión mediante Google OAuth, los datos se intercambian con Google conforme a sus propias condiciones de servicio y política de privacidad.\n— Vercel Inc.: proveedor de alojamiento de la aplicación web, que actúa como encargado del tratamiento.\n\nEn ningún caso se ceden datos a terceros con fines publicitarios sin consentimiento expreso del usuario.`,
          },
          {
            title: '7. Derechos del usuario',
            content: `El usuario puede ejercer en cualquier momento los siguientes derechos:\n\n— Acceso: conocer qué datos personales se están tratando.\n— Rectificación: corregir datos inexactos o incompletos.\n— Supresión: solicitar la eliminación de sus datos.\n— Oposición: oponerse al tratamiento de sus datos para determinadas finalidades.\n— Limitación del tratamiento: solicitar que se suspenda el tratamiento de sus datos.\n— Portabilidad: recibir sus datos en un formato estructurado y de uso común.\n\nPara ejercer cualquiera de estos derechos, el usuario puede dirigirse a colivasbon@gmail.com, indicando el derecho que desea ejercer y aportando documentación que acredite su identidad.\n\nAsimismo, si considera que el tratamiento de sus datos no es conforme a la normativa vigente, puede presentar una reclamación ante la Agencia Española de Protección de Datos (www.aepd.es).`,
          },
          {
            title: '8. Seguridad de los datos',
            content: `TeamUp aplica medidas técnicas y organizativas apropiadas para proteger los datos personales frente al acceso no autorizado, la pérdida accidental o la destrucción. Entre estas medidas se incluyen el cifrado de las comunicaciones mediante TLS, el control de acceso a la base de datos mediante políticas de seguridad a nivel de fila (Row Level Security), y la autenticación segura gestionada por Supabase.`,
          },
          {
            title: '9. Modificaciones de esta política',
            content: `TeamUp se reserva el derecho a modificar esta Política de Privacidad para adaptarla a cambios legislativos o a nuevas funcionalidades del servicio. Cualquier modificación relevante será comunicada a los usuarios mediante notificación dentro de la aplicación. El uso continuado del servicio tras la publicación de los cambios implica la aceptación de los mismos.`,
          },
        ].map(section => (
          <div key={section.title} style={{ marginBottom: 28 }}>
            <h2 style={{ fontWeight: 800, fontSize: 15, color: 'var(--text)', marginBottom: 10, letterSpacing: '-0.02em' }}>
              {section.title}
            </h2>
            <div style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.7 }}>
              {section.content.split('\n').map((line, i) => (
                <p key={i} style={{ margin: line === '' ? '8px 0' : '0 0 4px 0' }}>{line}</p>
              ))}
            </div>
          </div>
        ))}

        <div style={{ marginTop: 32, padding: '16px 18px', background: 'var(--surface)', borderRadius: 14, border: '1px solid var(--border)', fontSize: 13, color: 'var(--muted)', lineHeight: 1.6 }}>
          Para cualquier consulta sobre esta política, contacta con nosotros en{' '}
          <a href="mailto:colivasbon@gmail.com" style={{ color: 'var(--primary)', fontWeight: 600 }}>
            colivasbon@gmail.com
          </a>
        </div>

      </div>
      <Navbar />
    </>
  )
}
