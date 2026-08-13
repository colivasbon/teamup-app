import AuthClient from './AuthClient'

export const metadata = {
  title: 'Entrar o Registrarse',
  description: 'Crea tu cuenta gratuita en TeamUp con email o Google y empieza a unirte a eventos deportivos, partidos de pádel, fútbol 7 y quedadas deportivas cerca de ti.',
  robots: {
    index: false,
    follow: false,
  },
}

export default function AuthPage() {
  return <AuthClient />
}