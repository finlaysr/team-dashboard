#set document(title: "CA Team Lines", author: "Camanachd Association")

#set page(paper: "a4", margin: (x: 0.8cm, y: 0.5cm))
#set text(lang: "EN", region: "GB", font: "PT Sans", size: 14pt)

#let darkblue = rgb(9, 13, 127)
#set text(fill: darkblue)
#show table.cell: it => {
  if it.y != 0 {
    text(fill: black, style: "italic")[#it]
  } else {
    it
  }
}

#let data = json("data.json")
#let playerCount = 12
#let subCount = 5

#let underlined(body, width: auto) = {
  box(width: width, stroke: (bottom: 1pt + darkblue), inset: (bottom: 1pt))[
    #align(center)[
      #text(size: 13pt, style: "italic", fill: black)[
        #body
      ]
    ]
  ]
}

#block(below: 18pt)[
  #text(size: 29pt)[
    *Camanachd Association * | Official Team Lines
  ]
]
#box(fill: rgb(200, 200, 200, 128), width: 100%, radius: 0.5cm, inset: 0.3cm, outset: 0cm)[
  #block(below: 8pt)[
    #box(inset: (x: 0.3cm, y: 0.3cm))[
      #par(leading: 22pt)[
        Competition #underlined(width: 3fr)[#data.competition]
        Date #underlined(width: 1fr)[#data.date]
        \
        Home Team #underlined(width: 1fr)[#data.homeTeam]
        v #underlined(width: 1fr)[#data.visitors] Visitors
      ]
    ]
  ]

  #box(fill: white, radius: 0.25cm, inset: (top: 0pt, x: 0.2cm, bottom: 0.4cm))[
    #table(
      columns: (2.5cm, 7cm, 4.3cm, 1fr),
      rows: (auto, ..range(playerCount).map(i => 0.6cm)),
      stroke: (x, y) => {
        (
          left: { if x != 0 { darkblue + 0.5pt } else { 0pt } },
          top: { if y != 0 { darkblue + 0.5pt } else { 0pt } },
          right: { if x != 3 { darkblue + 0.5pt } else { 0pt } },
          bottom: darkblue + 0.5pt,
        )
      },
      [Jersey No.], [Name], [Membership No.], [Youth Player (Y)\ Helmet Waiver (HW)],

      ..data
        .players
        .slice(0, count: calc.min(playerCount, data.players.len()))
        .map(p => (str(p.num), p.name, str(p.membNum), p.youthHelmet))
        .flatten(),
    )
  ]

  #block(below: 4pt)[
    #box(inset: (x: 0.3cm, y: 0cm))[
      *Substitutes*
    ]
  ]

  #box(fill: white, radius: 0.25cm, inset: (top: 0pt, x: 0.2cm, bottom: 0.4cm))[
    #table(
      columns: (2.5cm, 7cm, 4.3cm, 1fr),
      rows: (auto, ..range(subCount).map(i => 0.6cm)),
      stroke: (x, y) => {
        (
          left: { if x != 0 { darkblue + 0.5pt } else { 0pt } },
          top: { if y != 0 { darkblue + 0.5pt } else { 0pt } },
          right: { if x != 3 { darkblue + 0.5pt } else { 0pt } },
          bottom: darkblue + 0.5pt,
        )
      },
      [Jersey No.], [Name], [Membership No.], [Youth Player (Y)\ Helmet Waiver (HW)],

      ..data
        .substitutes
        .slice(0, count: calc.min(subCount, data.substitutes.len()))
        .map(p => (str(p.num), p.name, str(p.membNum), p.youthHelmet))
        .flatten(),
    )
  ]

  #block(above: 8pt)[
    #box(inset: (left: 0.7cm, right: 0.3cm, y: 0cm))[
      #text(size: 11.5pt)[
        *Y:* A player who is under 17 years on 1st January must wear a helmet. Please indicate youth players. (Y)
        \
        *HW:* Please also indicate players who have signed a Helmet Waiver Form. (HW)]
    ]
  ]

  #box(inset: (x: 0.3cm, y: 0cm))[
    #par(leading: 20pt)[
      Referee #underlined(width: 1fr)[#data.referee]
      \
      Signed #underlined(width: 1fr)[]
      Print Name #underlined(width: 1fr)[#data.printName]
      \
      Club #underlined(width: 1fr)[#data.club]
      \
      #text(size: 11pt)[
        Top Copy - Referee | Middle Copy - Opponent | Bottom Copy - Retain
      ]
    ]
  ]
]

#block(above: 0.2cm, below: 0cm)[
  #box(width: auto, height: 4.2cm)[
    #image("shinty-logo.png")
  ]
]

#place(right + bottom, dx: 1.3cm, dy: 0.3cm)[
  #box(height: 5.4cm, width: auto)[
    #image("shinty-ball.png")
  ]
]
