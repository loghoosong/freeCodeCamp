class Category:
    def __init__(self, name):
        self.name = name
        self.__balance = 0
        self.ledger = []

    def deposit(self, amount, description=''):
        self.__balance += amount
        self.ledger.append({"amount": amount, "description": description})

    def withdraw(self, amount, description=''):
        if self.check_funds(amount):
            self.__balance -= amount
            self.ledger.append({"amount": -amount, "description": description})
            return True
        return False

    def get_balance(self):
        return self.__balance

    def transfer(self, amount, category):
        if self.withdraw(amount, 'Transfer to ' + category.name):
            category.deposit(amount, 'Transfer from ' + self.name)
            return True
        return False

    def check_funds(self, amount):
        return True if self.__balance >= amount else False

    def __str__(self):
        res = self.name.center(30, '*') + '\n'
        for ledger in self.ledger:
            res += '{0:<23}{1:>7.2f}\n'.format(
                ledger['description'][:23], ledger['amount'])
        res += 'Total: {0:.2f}'.format(self.__balance)
        return res


def create_spend_chart(categories):
    n = len(categories)
    total_withdraw = 0
    withdraws = [0] * n
    names = [''] * n

    # calculate percentage
    for i, category in enumerate(categories):
        names[i] = category.name
        for ledger in category.ledger:
            if ledger['amount'] < 0:
                withdraws[i] -= ledger['amount']
        total_withdraw += withdraws[i]
    for i, w in enumerate(withdraws):
        # round down是向下取整，中文翻译的“四舍五入”不太对
        withdraws[i] = int(w / total_withdraw * 10) * 10

    bar_chart = 'Percentage spent by category'
    # append percentage
    for p in range(100, -1, -10):
        bar_chart += '\n{0:>3}| '.format(p)
        os = [' '] * n
        for i, w in enumerate(withdraws):
            if w >= p:
                os[i] = 'o'
        bar_chart += '  '.join(os) + '  '
    # horizontal line
    bar_chart += '\n    ' + '-' * (3 * n + 1)
    # append name
    max_name_len = 0
    for name in names:
        max_name_len = max(max_name_len, len(name))
    for row in range(max_name_len):
        bar_chart += '\n     '
        chars = [' '] * n
        for i, name in enumerate(names):
            if len(name) > row:
                chars[i] = name[row]
        bar_chart += '  '.join(chars) + '  '
    print(bar_chart)
    return bar_chart
