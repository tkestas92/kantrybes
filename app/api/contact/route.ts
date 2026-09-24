import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
  try {
    const { name, email, message } = await req.json()

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Trūksta laukų' }, { status: 400 })
    }

    const { error } = await resend.emails.send({
      from: 'Kantrybės kontaktai <kontaktai@kantrybes.lt>',
      to: process.env.CONTACT_EMAIL!,
      replyTo: email,
      subject: `Nauja žinutė nuo ${name} — kantrybes.lt`,
      text: `Vardas: ${name}\nEmail: ${email}\n\nŽinutė:\n${message}`,
    })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Nepavyko išsiųsti'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
