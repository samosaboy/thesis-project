export const data = [
  {
    "id": 1,
    "importance": 3,
    "type": "political",
    "stats": [
      {
        "type": "death",
        "value": 470000,
        "increment": {
          "type": "positive",
          "value": 5,
          "rate": "hourly"
        }
      },
      {
        "type": "detained",
        "value": 117000,
        "increment": {
          "type": "negative",
          "value": 1,
          "rate": "day"
        }
      }
    ],
    "description": "The ongoing civil war",
    "position": {
      "left": 700,
      "top": 200
    },
    "geo": {
      "city": "Damascus",
      "map": "Syria"
    },
    "ripples": [
      {
        "id": 1,
        "name": "Syrian regime bombs civilians in Eastern Ghouta.",
        "description": "A besieged area consisting of young families and children on the outskirts of Damascus has been under constant bombing. A child's scream generally reaches 115 decibels. A bomb exploding reaches 240 - 280 decibels.<br /><br />It has been estimated that 393,000 people have been trapped in this region since mid-November 2017."
      },
      {
        "id": 2,
        "name": "U.S. launches 59 missles from the Mediterranean Sea which strike an airbase in Syria.",
        "description": "The Mediterranean Sea has hundreds of cargo ships and warships at any given time. One ship generates 100 decibels. A human screaming generates 120 decibels.<br /><br />There is one refugee death at sea per 269 refugees that reach the shores of Europe."
      },
      {
        "id": 3,
        "name": "The footsteps of 5,440,749 refugees.",
        "description": "One of the closest safe havens is Horgos, Serbia, which is 2,973,960 footsteps from Damascus. It would take <b>50 days at 8 hours per day</b> to walk there. <br /><br />A calm spring day is about 40 decibels. The sound of casual conversation is 60 decibels. The sound of a helicopter passing by is 105 decibels. The sound of a truck driving by is 90 decibels."
      }
    ]
  }
]
