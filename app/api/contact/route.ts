import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
  try {
    const { name, email, message, lang } = await req.json()
    const language = lang === 'en' ? 'EN' : 'LT'

    if (!String(name ?? '').trim() || !String(email ?? '').trim() || !String(message ?? '').trim()) {
      return NextResponse.json({ error: 'missing_fields' }, { status: 400 })
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).trim())) {
      return NextResponse.json({ error: 'invalid_email' }, { status: 400 })
    }

    const { error } = await resend.emails.send({
      from: 'Kantrybės kontaktai <kontaktai@kantrybes.lt>',
      to: process.env.CONTACT_EMAIL!,
      replyTo: email,
      subject: `Nauja žinutė nuo ${name} — kantrybes.lt`,
      text: `Language: ${language}\nVardas: ${name}\nEmail: ${email}\n\nŽinutė:\n${message}`,
    })

    if (error) {
      return NextResponse.json({ error: 'send_failed' }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'send_failed' }, { status: 500 })
  }
}
