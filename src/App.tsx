import { Chrome } from './components/Chrome'
import { C } from './lib/theme'
import { Audit } from './screens/Audit'
import { Auth } from './screens/Auth'
import { Builder } from './screens/Builder'
import { BrokerDone, BrokerOauth, BrokerSelect } from './screens/BrokerFlow'
import { Landing } from './screens/Landing'
import { Monitor } from './screens/Monitor'
import { Settings } from './screens/Settings'
import { Strategies } from './screens/Strategies'
import { useApp } from './state/useApp'
import type { AppProps } from './state/types'

export default function App(props: Partial<AppProps> = {}) {
  const app = useApp(props)

  // The landing page is full-bleed, so it sits outside the app shell's padding.
  if (app.isLanding) return <Landing app={app} />

  return (
    <div style={{ minHeight: '100vh', background: C.bg, padding: '22px 26px 90px' }}>
      {app.showChrome && <Chrome app={app} />}

      {app.isStrategies && <Strategies app={app} />}
      {app.isBuilder && <Builder app={app} />}
      {app.isMonitor && <Monitor app={app} />}
      {app.isAudit && <Audit app={app} />}
      {app.isSettings && <Settings app={app} />}

      {app.isAuth && <Auth app={app} />}
      {app.isBrokerSelect && <BrokerSelect app={app} />}
      {app.isOauth && <BrokerOauth app={app} />}
      {app.isBrokerDone && <BrokerDone app={app} />}
    </div>
  )
}
