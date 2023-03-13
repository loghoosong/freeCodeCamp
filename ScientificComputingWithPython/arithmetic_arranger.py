import re


def arithmetic_arranger(problems, showResult=False):
    line1st = line2nd = dashes = result = ''

    if len(problems) > 5:
        return 'Error: Too many problems.'

    for problem in problems:
        (n1, op, n2) = problem.split()
        if not (op == '+' or op == '-'):
            return "Error: Operator must be '+' or '-'."
        if not (re.match(r'^\d+$', n1) and re.match(r'^\d+$', n2)):
            return 'Error: Numbers must only contain digits.'
        if len(n1) > 4 or len(n2) > 4:
            return 'Error: Numbers cannot be more than four digits.'

        if (len(line1st) > 0):
            line1st += '    '
            line2nd += '    '
            dashes += '    '
            result += '    '
        maxLen = max(len(n1), len(n2))
        line1st += n1.rjust(maxLen + 2)
        line2nd += op + n2.rjust(maxLen+1)
        dashes += '-' * maxLen + 2
        if (op == '+'):
            result += str(int(n1) + int(n2)).rjust(maxLen + 2)
        else:
            result += str(int(n1) - int(n2)).rjust(maxLen + 2)

    arranged_problems = line1st + '\n' + line2nd + '\n' + dashes
    if (showResult):
        arranged_problems = arranged_problems + '\n' + result
    return arranged_problems


print(arithmetic_arranger(
    ["32 + 8", "1 - 3801", "9999 + 9999", "523 - 49"], True))
