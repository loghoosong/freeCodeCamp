def add_time(start, duration, day=None):
    def toMinutes(timeStr):
        try:
            (time, meridiem) = timeStr.split()
        except:
            time = timeStr
            meridiem = None

        (h, m) = time.split(':')
        if h == 12 and meridiem == 'AM':
            return int(m)
        elif meridiem == None or meridiem == 'AM':
            return int(h) * 60 + int(m)
        else:
            return (int(h) + 12) * 60 + int(m)

    def toTimeStr(minutes):
        m = minutes % 60
        h = minutes // 60 % 24
        d = minutes // 1440
        if h == 0:
            timeStr = '12:{0:0>2} AM'.format(m)
        elif h < 12:
            timeStr = '{0}:{1:0>2} AM'.format(h, m)
        elif h == 12:
            timeStr = '{0}:{1:0>2} PM'.format(h, m)
        else:
            timeStr = '{0}:{1:0>2} PM'.format(h - 12, m)
        return (timeStr, d)

    days = ['monday', 'tuesday', 'wednesday',
            'thursday', 'friday', 'saturday', 'sunday']

    start = toMinutes(start)
    duration = toMinutes(duration)
    (new_time, d) = toTimeStr(start + duration)

    if day:
        daysIdx = days.index(day.lower())
        daysIdx = (daysIdx + d) % 7
        new_time += ', ' + days[daysIdx].capitalize()

    if d == 1:
        new_time += ' (next day)'
    elif d > 1:
        new_time += ' ({0} days later)'.format(d)
    return new_time


add_time("11:43 PM", "24:20", "tueSday")
