import numpy as np


def calculate(list):
    if len(list) < 9:
        raise ValueError('List must contain nine numbers.')

    nparray = np.array(list[0:9]).reshape((3, 3))

    calculations = {}
    props = (('mean', np.mean),
             ('variance', np.var),
             ('standard deviation', np.std),
             ('max', np.amax),
             ('min', np.amin),
             ('sum', np.sum))
    for (prop, func) in props:
        calculations[prop] = [func(nparray, axis=0).tolist(),
                              func(nparray, axis=1).tolist(),
                              func(nparray).tolist()]

    return calculations
