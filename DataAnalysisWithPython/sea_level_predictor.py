
import os
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from scipy.stats import linregress


def draw_plot():
    # Read data from file
    df = pd.read_csv(
        os.getcwd() + r'\DataAnalysisWithPython\epa-sea-level.csv')
    # df = pd.read_csv('epa-sea-level.csv')

    # Create scatter plot
    fig, ax = plt.subplots()
    ax.scatter(df['Year'], df['CSIRO Adjusted Sea Level'], marker='.')
    ax.set_xlim(1850, 2075)

    # Create first line of best fit
    x1 = np.arange(1880, 2051)
    res1 = linregress(df['Year'], df['CSIRO Adjusted Sea Level'])
    ax.plot(x1, res1.intercept + res1.slope * x1, 'r')

    # Create second line of best fit
    x2 = np.arange(2000, 2051)
    df_after_2000 = df[df['Year'] >= 2000]
    res2 = linregress(df_after_2000['Year'],
                      df_after_2000['CSIRO Adjusted Sea Level'])
    ax.plot(x2, res2.intercept + res2.slope * x2, 'm')

    # Add labels and title
    ax.set_title('Rise in Sea Level')
    ax.set_xlabel('Year')
    ax.set_ylabel('Sea Level (inches)')

    # Save plot and return data for testing (DO NOT MODIFY)
    plt.savefig('sea_level_plot.png')
    return plt.gca()
