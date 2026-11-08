#!/usr/bin/env python3
"""Editable Cockatiel illustrations. Python stdlib + rsvg-convert (librsvg).
Run from any directory; writes SVG/PNG/PDF beside this script.
All software claims derive from the supplied 2026-10-14 working account.
"""
from pathlib import Path
from html import escape
import subprocess

OUT=Path(__file__).resolve().parent
INK='#19333E'; MUTED='#526873'; TEAL='#007A78'; PALE='#E6F3F0'
RED='#B44635'; ROSE='#FBECE6'; AMBER='#95600B'; CREAM='#FFF2D4'
PURPLE='#7047A3'; LILAC='#F0EAF8'; BLUE='#356989'; PAPER='#FCFBF7'; LINE='#C9D4D5'
W,H=1600,1100

class Drawing:
 def __init__(self,n,title,subtitle):
  self.s=[f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}"><title>{escape(title)}</title><desc>{escape(subtitle)}</desc>', '<defs>']
  for name,color in [('ink',INK),('teal',TEAL),('red',RED),('purple',PURPLE),('muted',MUTED)]:
   self.s.append(f'<marker id="{name}" viewBox="0 0 12 12" refX="10" refY="6" markerWidth="8" markerHeight="8" orient="auto-start-reverse"><path d="M 1 1 L 11 6 L 1 11 Z" fill="{color}"/></marker>')
  self.s.append('</defs>')
  self.rect(0,0,W,H,PAPER,stroke='none',r=0)
  self.text(60,48,'COCKATIEL  /  A PICTORIAL WORKING ACCOUNT',18,TEAL,700)
  self.text(1540,48,f'0{n} / 04',18,MUTED,600,'end')
  self.text(60,108,title,43,INK,700)
  self.text(60,151,subtitle,23,MUTED)
  self.line(60,1026,1540,1026,LINE,1)
  self.text(60,1057,'Source: 14 Oct 2026 working account, first extraction. Static inspection; no runtime verification.',17,MUTED)
  self.text(1540,1057,f'VIEW {n}',17,MUTED,600,'end')
 def add(self,s): self.s.append(s)
 def text(self,x,y,s,size=23,color=INK,weight=400,anchor='start'):
  self.add(f'<text x="{x}" y="{y}" font-family="Arial, Helvetica, sans-serif" font-size="{size}" font-weight="{weight}" fill="{color}" text-anchor="{anchor}">{escape(s)}</text>')
 def lines(self,x,y,ss,size=23,color=INK,weight=400,gap=None,anchor='start'):
  for i,s in enumerate(ss): self.text(x,y+i*(gap or size*1.35),s,size,color,weight,anchor)
 def rect(self,x,y,w,h,fill='none',stroke=LINE,sw=2,r=14,dash=None):
  self.add(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{r}" fill="{fill}" stroke="{stroke}" stroke-width="{sw}"'+(f' stroke-dasharray="{dash}"' if dash else '')+'/>')
 def line(self,x,y,x2,y2,color=INK,sw=3,dash=None,arrow=None):
  self.add(f'<path d="M{x},{y} L{x2},{y2}" fill="none" stroke="{color}" stroke-width="{sw}" stroke-linecap="round"'+(f' stroke-dasharray="{dash}"' if dash else '')+(f' marker-end="url(#{arrow})"' if arrow else '')+'/>')
 def path(self,path,color=INK,sw=3,arrow=None,dash=None,fill='none'):
  self.add(f'<path d="{path}" fill="{fill}" stroke="{color}" stroke-width="{sw}" stroke-linecap="round" stroke-linejoin="round"'+(f' marker-end="url(#{arrow})"' if arrow else '')+(f' stroke-dasharray="{dash}"' if dash else '')+'/>')
 def circle(self,x,y,r,fill=PAPER,stroke=INK,sw=3): self.add(f'<circle cx="{x}" cy="{y}" r="{r}" fill="{fill}" stroke="{stroke}" stroke-width="{sw}"/>')
 def pill(self,x,y,w,s,color=TEAL,fill=PALE):
  self.rect(x,y,w,32,fill,stroke='none',r=16);self.text(x+w/2,y+22,s,16,color,700,'middle')
 def ticket(self,x,y,label='op',color=TEAL,scale=1):
  self.add(f'<g transform="translate({x} {y}) scale({scale})">')
  self.path('M0 0 H54 L70 16 V78 H0 Z',color,3,fill=PAPER)
  self.path('M54 0 V16 H70',color,2)
  self.text(35,46,label,22,color,700,'middle')
  self.line(16,60,54,60,color,2)
  self.add('</g>')
 def switch(self,x,y,state='open',color=None,scale=1):
  color=color or (RED if state=='open' else AMBER if state=='trial' else TEAL)
  self.add(f'<g transform="translate({x} {y}) scale({scale})">')
  self.line(0,55,38,55,color,5);self.line(112,55,150,55,color,5)
  self.circle(38,55,6,PAPER,color,3);self.circle(112,55,6,PAPER,color,3)
  if state=='closed': self.line(44,55,106,55,color,5)
  else:
   self.line(43,51,96,12,color,5)
   if state=='trial': self.line(52,65,99,65,color,3,arrow='ink')
  self.add('</g>')
 def slot(self,x,y,occupied=False,label='op',color=TEAL,w=110,h=112):
  self.path(f'M{x} {y} V{y+h} H{x+w} V{y}',color,4)
  if occupied:
   scale=min(.8,(h-22)/78,(w-15)/70)
   self.ticket(x+(w-70*scale)/2,y+12,label,color,scale)
 def clock(self,x,y,color=MUTED,r=29):
  self.circle(x,y,r,PAPER,color,3);self.path(f'M{x} {y-r*.6} V{y} L{x+r*.45} {y+r*.23}',color,3)
 def eye(self,x,y,color=INK):
  self.path(f'M{x-35} {y} Q{x} {y-36} {x+35} {y} Q{x} {y+36} {x-35} {y}',color,3)
  self.circle(x,y,10,color,color,1)
 def cross(self,x,y,color=RED):
  self.line(x-13,y-13,x+13,y+13,color,5);self.line(x-13,y+13,x+13,y-13,color,5)
 def save(self,name):
  p=OUT/(name+'.svg');p.write_text(''.join(self.s)+'</svg>')
  subprocess.run(['rsvg-convert','-w','2000','-o',str(OUT/(name+'.png')),str(p)],check=True)
  return p

# VIEW 1: the lifecycle stays with the application; policy state persists.
d=Drawing(1,'The application owns the job; policies govern execution',
          'Follow one supplied operation, then distinguish reusable policy state from one call\'s progress.')
d.rect(60,197,425,670,'#F0F2EE',stroke='none')
d.text(90,241,'APPLICATION',20,INK,700)
d.text(90,277,'Owns the business lifecycle',25,INK,700)
# Job folder, preparation bench, durable records as application objects.
d.path('M105 335 V318 H181 L202 335 H292 V454 H105 Z',BLUE,3,fill=PAPER)
d.ticket(130,344,'job',BLUE,.85)
d.text(320,360,'Identity',23,INK,600)
d.lines(320,394,['Prepare','Acknowledge','Store outcome'],19,MUTED,gap=28)
d.lines(90,527,['Creates and retains policies.','Chooses which operations','share each instance.'],24,INK,gap=34)
d.lines(90,671,['No automatic grouping','by the service contacted.'],22,BLUE,600,gap=30)
d.text(90,807,'Value or error returns here',22,INK,600)
d.rect(535,197,1005,670,PALE,stroke=TEAL,sw=2)
d.text(565,241,'POLICY-CONTROLLED EXECUTION',20,TEAL,700)
d.text(565,279,'Application supplies the work; Cockatiel need not know its business meaning.',22,INK)
d.ticket(580,345,'op');d.text(615,457,'operation',19,MUTED,400,'middle')
d.line(655,386,782,386,TEAL,3,arrow='teal');d.text(720,365,'execute',19,TEAL,600,'middle')
# reusable policy housing
d.rect(800,318,397,200,PAPER,TEAL,3,20)
d.text(998,354,'Reusable policy object(s)',25,INK,700,'middle')
d.switch(837,375,'closed',scale=.8)
d.slot(1000,381,True,'op',w=75,h=80)
d.text(1123,427,'...',40,TEAL,700,'middle')
d.line(1197,386,1301,386,TEAL,3,arrow='teal')
d.text(1249,365,'calls',19,TEAL,600,'middle')
d.circle(1390,386,59,PAPER,TEAL,3)
d.path('M1377 359 L1415 386 L1377 413 Z',TEAL,2,fill=TEAL)
d.lines(1390,475,['Supplied work'],21,INK,600,anchor='middle')
d.path('M1197 487 H1490 V826 H484',INK,3,arrow='ink')
d.text(1450,805,'eventual value / error',20,INK,400,'end')
# persistent memory vs execution-local footsteps
d.line(998,520,998,561,TEAL,2)
d.rect(565,565,540,195,PAPER,TEAL,2)
d.text(590,601,'State shared across calls',25,TEAL,700)
d.switch(595,626,'open',scale=.7)
d.lines(735,636,['Breaker: failure / recovery state','Bulkhead: running count +','in-memory waiting queue'],20,INK,gap=29)
d.text(1140,588,'One execution',23,INK,700)
for i,x in enumerate([1150,1250,1350]):
 d.circle(x,641,24,PAPER,TEAL,2);d.text(x,649,str(i+1),22,TEAL,700,'middle')
 if i<2:d.line(x+28,641,x+66,641,TEAL,2,arrow='teal')
d.lines(1140,704,['Retry-attempt progress','belongs to this execution.'],20,INK,gap=28)
d.lines(60,922,['Read this as a division of responsibilities, not a deployment diagram.',
                'The operation ticket is an invocation, not a durable submitted job. Symbols recur in the next views.'],23,INK,gap=34)
p1=d.save('01-ownership')

# VIEW 2: three distinct admission outcomes and breaker states.
d=Drawing(2,'Starting, waiting and succeeding are different',
          'Illustrative states, not execution traces. Repeated tickets along arrows show the same call at successive positions.')
d.text(60,218,'BULKHEAD  /  CAPACITY',22,TEAL,700)
d.text(60,250,'Example only: 1 execution slot + 1 queue slot',20,MUTED)
d.text(880,218,'BREAKER  /  PERMISSION',22,TEAL,700)
d.text(880,250,'Default single-trial example for half-open',20,MUTED)
d.line(819,203,819,809,LINE,2)
# left rows
for row,y in enumerate([292,458,624]):
 d.ticket(77,y+8,'new',TEAL,.7)
 d.line(137,y+39,183,y+39,TEAL,3,arrow='teal')
 d.slot(213,y,True,'new' if row==0 else 'run',TEAL,w=93,h=98)
 d.slot(343,y,row==2,'wait',AMBER,w=93,h=98)
 if row==1: d.ticket(361,y+17,'new',AMBER,.7)
 d.text(260,y+124,'execution',17,MUTED,400,'middle')
 d.text(390,y+124,'queue',17,MUTED,400,'middle')
 if row==0:
  d.text(476,y+29,'START',25,TEAL,700);d.lines(476,y+64,['Capacity available.','Outcome still pending.'],21,INK,gap=29)
 elif row==1:
  d.text(476,y+29,'WAIT',25,AMBER,700);d.lines(476,y+64,['Execution full; queue has room.','Result remains pending.'],20,INK,gap=29)
 else:
  d.cross(172,y+39);d.text(476,y+29,'REFUSE',25,RED,700);d.lines(476,y+64,['Both capacities exhausted.','Admission error.'],21,INK,gap=29)
# right states, switch icon semantics explicitly labelled
d.switch(880,283,'closed');d.text(1070,313,'CLOSED',25,TEAL,700);d.text(1070,351,'Normally allows work',22)
d.switch(880,405,'open');d.text(1070,435,'OPEN',25,RED,700);d.text(1070,473,'Withholds attempts',22)
d.switch(880,530,'trial');d.text(1070,560,'HALF-OPEN',25,AMBER,700);d.text(1070,598,'Allows limited recovery work',22)
d.ticket(899,649,'trial',AMBER,.72)
d.ticket(1010,655,'wait',MUTED,.6);d.ticket(1030,670,'wait',MUTED,.6)
d.lines(1110,661,['While one trial runs, others wait.','Then they face the new decision;','they can still be refused.'],20,INK,gap=28)
d.text(880,780,'Manual isolation can also hold the breaker open.',20,MUTED)
# snapshot nonreservation band
d.rect(60,841,1480,151,'#EEF1F3',stroke='none')
d.eye(109,895,BLUE)
d.slot(173,864,False,color=BLUE,w=60,h=62)
d.line(260,898,350,898,MUTED,2,arrow='muted')
d.clock(393,898,MUTED,26)
d.line(433,898,523,898,MUTED,2,arrow='muted')
d.slot(550,864,True,'op',BLUE,w=65,h=62)
d.text(108,968,'look',18,MUTED,400,'middle');d.text(393,968,'time passes',18,MUTED,400,'middle');d.text(584,968,'another call',18,MUTED,400,'middle')
d.text(680,884,'A snapshot reserves nothing.',28,INK,700)
d.lines(680,920,['Capacity or state can change before execution.','Waiting is not failure; trial eligibility is not proof of health.'],22,INK,gap=32)
p2=d.save('02-admission')

# VIEW 3: nested physical boundaries display held resources.
d=Drawing(3,'The outside policy controls calls into the inside',
          'Wrapping retains the component instances and their separate states. Order changes where work can wait.')
d.pill(60,195,228,'ILLUSTRATIVE SITUATIONS')
d.text(318,217,'Repeated tickets along arrows show successive positions of the same call.',19,MUTED)
d.text(65,270,'A',27,INK,700)
d.rect(118,240,937,269,PALE,TEAL,3,18)
d.text(146,278,'OUTER: BULKHEAD',20,TEAL,700)
d.path('M157 320 V477 H1017 V320',TEAL,5)
d.text(180,458,'An execution slot is occupied',22,TEAL,600)
d.ticket(213,324,'op',AMBER,.9)
d.line(298,360,388,360,AMBER,3,arrow='ink')
d.text(333,398,'waiting',19,AMBER,600,'middle')
d.rect(410,301,582,112,PAPER,AMBER,2,10)
d.text(433,333,'INNER: BREAKER',18,AMBER,700)
d.switch(442,339,'trial',scale=.6)
d.circle(593,370,25,CREAM,AMBER,2)
d.text(593,377,'busy',16,AMBER,700,'middle')
d.lines(667,363,['Another recovery trial','is already running'],20,INK,gap=27)
d.lines(1110,302,['Capacity can be held','while waiting for','the breaker.'],27,INK,600,gap=38)
d.lines(1110,442,['Occupied capacity need not mean','the supplied work has started.'],20,MUTED,gap=29)
d.text(65,572,'B',27,INK,700)
d.rect(118,542,937,267,CREAM,AMBER,3,18)
d.text(146,581,'OUTER: BREAKER',20,AMBER,700)
d.switch(158,616,'trial',scale=.8)
d.line(288,660,359,660,AMBER,3,arrow='ink')
d.ticket(380,621,'trial',AMBER,.85)
d.text(410,741,'admitted',20,AMBER,600,'middle')
d.rect(521,600,496,174,PAPER,TEAL,2,10)
d.text(547,634,'INNER: BULKHEAD',18,TEAL,700)
d.slot(551,650,True,'run',TEAL,w=83,h=96)
d.slot(685,650,True,'trial',AMBER,w=83,h=96)
d.lines(803,681,['Capacity full;','trial waits','in queue'],20,INK,gap=27)
d.line(445,660,507,660,AMBER,3,arrow='ink')
d.lines(1110,603,['A recovery attempt','can be admitted,','then wait for capacity.'],27,INK,600,gap=38)
d.lines(1110,742,['Admission by one policy does not','settle the whole composition.'],20,MUTED,gap=29)
# Retry loop uses same breaker each attempt
d.rect(60,849,1480,150,'#EEF1F3',stroke='none')
d.text(85,880,'RETRY OUTSIDE A BREAKER',18,BLUE,700)
d.ticket(92,904,'op',TEAL,.58)
d.line(141,928,206,928,TEAL,3,arrow='teal')
d.switch(226,885,'closed',scale=.7)
d.line(338,928,407,928,TEAL,3,arrow='teal')
d.circle(454,928,29,PAPER,TEAL,2);d.text(454,936,'work',16,TEAL,700,'middle')
d.path('M454 960 V981 H185 V943',BLUE,2,arrow='ink')
d.lines(560,890,['Selected failure? Another attempt calls through the breaker again.','Policy events describe local activity, not one whole-composition verdict.','An outer retry or fallback can handle an inner failure before the caller sees it.'],22,INK,gap=35)
p3=d.save('03-composition')

# VIEW 4: matched timelines show the one chosen semantic change.
d=Drawing(4,'Move the transition, not the work',
          'Reported need: avoid expensive job preparation while the breaker blocks work. Scenario not reproduced.')
d.pill(60,190,243,'REPORTED APPLICATION LOOP',RED,ROSE)
d.eye(100,267,RED)
d.line(143,267,199,267,RED,3,arrow='red')
d.text(222,275,'reads OPEN',23,RED,700)
d.line(367,267,425,267,RED,3,arrow='red')
d.lines(450,256,['skips preparation','and execution'],21,INK,gap=28)
d.line(640,267,706,267,RED,3,arrow='red')
d.text(731,275,'no call to trigger recovery',23,RED,700)
d.path('M1040 267 H1095 V310 H100 V291',RED,2,arrow='red')
d.lines(1160,238,['This can keep stored','state OPEN even after','the delay has elapsed.'],21,INK,gap=30)
# shared time alignment
for x,lab in [(370,'Breaker opens'),(795,'Recovery delay elapses'),(1300,'Later execution, if any')]:
 d.text(x,365,lab,20,MUTED,600,'middle');d.line(x,380,x,794,LINE,1,dash='5 7')
d.text(60,425,'CURRENT',22,TEAL,700)
d.lines(60,461,['in the account','(also the proposed','default behavior)'],19,MUTED,gap=27)
d.line(280,465,1490,465,TEAL,3,arrow='teal')
d.pill(315,418,110,'OPEN',RED,ROSE);d.switch(327,471,'open',scale=.6)
d.pill(740,418,110,'OPEN',RED,ROSE);d.clock(795,507,MUTED,25)
d.lines(795,562,['No transition.', 'No transition event.'],20,INK,gap=27,anchor='middle')
d.pill(1220,418,163,'HALF-OPEN',AMBER,CREAM)
d.ticket(1267,480,'trial',AMBER,.72)
d.lines(1300,562,['Execution checks elapsed time,','transitions and supplies trial.'],19,INK,gap=27,anchor='middle')
# opt-in proposed lane
d.rect(60,611,1480,203,LILAC,PURPLE,2,16,dash='10 6')
d.text(84,652,'PROPOSED',22,PURPLE,700)
d.lines(84,687,['opt-in only','chosen in simulation'],19,PURPLE,gap=27)
d.line(280,678,1490,678,PURPLE,3,arrow='purple')
d.pill(315,630,110,'OPEN',RED,ROSE);d.switch(327,698,'open',scale=.6)
d.pill(713,630,165,'HALF-OPEN',PURPLE,'#FFFFFF')
d.clock(795,717,PURPLE,24)
d.lines(795,765,['Transition + state/event facility.','No work starts here.'],20,PURPLE,600,gap=27,anchor='middle')
d.line(901,716,1088,716,PURPLE,2,dash='5 5',arrow='purple')
d.lines(1003,743,['notice / inspect,','then prepare'],17,PURPLE,gap=24,anchor='middle')
d.ticket(1267,697,'trial',AMBER,.72)
d.lines(1370,736,['Outcome','unknown'],19,INK,gap=27)
# preference and unsettled questions distinguish status
d.pill(60,840,210,'HUMAN PREFERENCE',BLUE,'#E8EFF5')
d.text(292,864,'Solve the immediate need; fit existing facilities; avoid speculative expansion.',22,INK)
d.text(60,910,'?',38,AMBER,700)
d.lines(103,900,['Still to settle: event order + duplicate transitions; obsolete timers after isolation or reopening;',
                 'state restoration; timer lifetime + process liveness; compatibility; scenario reproduction.'],21,INK,gap=31)
d.text(60,992,'Eligibility is not reserved permission or demonstrated health. No implementation or maintainer acceptance is claimed.',21,PURPLE,600)
p4=d.save('04-recovery-change')

subprocess.run(['rsvg-convert','-f','pdf','-o',str(OUT/'cockatiel-illustrated.pdf'),*[str(p) for p in [p1,p2,p3,p4]]],check=True)
print('Created four SVGs, four PNGs and cockatiel-illustrated.pdf')
