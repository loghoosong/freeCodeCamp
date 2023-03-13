import copy
import random
# Consider using the modules imported above.


class Hat:
    def __init__(self, **kwargs) -> None:
        self.contents = []
        self.__total_number = 0
        for color, number in kwargs.items():
            self.contents += [color] * number
            self.__total_number += number

    def draw(self, number):
        if number >= self.__total_number:
            return self.contents[:]
        res = [''] * number
        for i in range(number):
            rand = random.randint(0, self.__total_number - 1)
            res[i] = self.contents[rand]
            self.__total_number -= 1
            self.contents[rand] = self.contents[self.__total_number]
        del self.contents[self.__total_number:]
        return res


def experiment(hat, expected_balls, num_balls_drawn, num_experiments):
    cnt = 0
    for i in range(num_experiments):
        expHat = copy.deepcopy(hat)
        balls = expHat.draw(num_balls_drawn)
        for color, number in expected_balls.items():
            if balls.count(color) < number:
                break
        else:
            cnt += 1
    return cnt / num_experiments
