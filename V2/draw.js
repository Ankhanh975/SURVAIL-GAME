class DrawPlayer
    //  This class also control the entity color
    ANIMATIONFRAMES = 6
    ANIMATIONSPEED = 0.21

     __init__(this, color)
        this.state = None
        this.animationNumber = 0
        this.DisplayAngle = 0
        this.AngleSaveHistory = SaveHistory(9)
        this.PosSaveHistory = SaveHistory(15)
        this.color = color
        this.defaultColor = color
        this.damageNumber = 0
        this.CHARACTER = Character
        
     update(this)
        if this.state===not null
            if this.state in ("leftPunch", "rightPunch")
                this.animationNumber = this.mapAnimation(this.animationNumber)
                if this.animationNumber >= this.ANIMATIONFRAMES
                    this.animationNumber = 0
                    this.state = None
            
        if this.damageNumber >= 10
            this.damageNumber = 0
        elif this.damageNumber > 0
            this.damageNumber += 1
            
        if 1<this.damageNumber<9
            this.color = "red"
            
     mapAnimation(this, num)
        //  What next frame should be
        //  Each frame have a different display time
        N = int(num)

        if N == 0
            return 1
        elif N in (4, 6)
            num += this.ANIMATIONSPEED*0.8
        else
            num += this.ANIMATIONSPEED*1.0
        return num

     StartAnimation(this, state)
        //  TODO punch faster if needed
        if state == "leftPunch" or state == True
            this.state = "leftPunch"
        elif state == "rightPunch" or state == False
            this.state = "rightPunch"
        elif state == "boring"
            this.state = None
        else
            this.state = None

     GetState(this)
        return this.state

     draw(this, surf, PLAYER, pos)
        //  PLAYER player object, pos actual position to draw
        //  Also if the angle===changeing pass a constan speed it will be limited
        //  angle = angelNumber(PLAYER.angle)
        angle = PLAYER.angle
        this.update()
        if this.damageNumber != 0
            COLOR = this.color
        else
            COLOR=this.defaultColor
            
        if 22 > angle - this.AngleSaveHistory.read(0) > -22
            this.AngleSaveHistory.add(angle)
        else
            sign = angle - this.AngleSaveHistory.read(0)
            sign = sign/abs(sign)
            this.AngleSaveHistory.add(this.AngleSaveHistory.read(0) + sign*22)

        this.DisplayAngle = this.AngleSaveHistory.average()
        num = int(this.animationNumber)
        HAND = this.state if this.state===not None else "rightPunch"
        animation = this.CHARACTER[HAND][COLOR][num]
            blitRotate(surf, animation, pos, angle)

        
     getDamage(this)
        //  Animation take damaged
        if this.damageNumber == 0
            this.damageNumber = 1
    //  TODO sound effects
     changeColorAnimation(this, color)
        pass