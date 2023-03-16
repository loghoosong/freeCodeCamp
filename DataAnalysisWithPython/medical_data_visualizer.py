import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt
import numpy as np
import os

# Import data
# df = pd.read_csv(os.getcwd() + r'\DataAnalysisWithPython\medical_examination.csv')
df = pd.read_csv('medical_examination.csv')

# Add 'overweight' column
bmi = (df['weight'] * 10000 / df['height'] ** 2 > 25)
df['overweight'] = bmi.astype('uint8')

# Normalize data by making 0 always good and 1 always bad. If the value of 'cholesterol' or 'gluc' is 1, make the value 0. If the value is more than 1, make the value 1.
df['cholesterol'] = df['cholesterol'].map(lambda x: 1 if x > 1 else 0)
df['gluc'] = df['gluc'].map(lambda x: 1 if x > 1 else 0)

# Draw Categorical Plot


def draw_cat_plot():
    # Create DataFrame for cat plot using `pd.melt` using just the values from 'cholesterol', 'gluc', 'smoke', 'alco', 'active', and 'overweight'.
    df_cat = df.melt(
        id_vars='cardio',
        value_vars=['cholesterol', 'gluc', 'smoke', 'alco', 'active', 'overweight'])

    # Group and reformat the data to split it by 'cardio'. Show the counts of each feature. You will have to rename one of the columns for the catplot to work correctly.
    df_cat = df_cat.reset_index() \
        .groupby(['cardio', 'variable', 'value']) \
        .count().reset_index() \
        .rename(columns={'index': 'total'})

    # Draw the catplot with 'sns.catplot()'
    # Get the figure for the output
    fig = sns.catplot(
        data=df_cat, x='variable', y='total', hue='value', col='cardio',
        kind='bar'
    ).figure    # catplot returns a FacetGrid

    # Do not modify the next two lines
    fig.savefig('catplot.png')
    return fig


# Draw Heat Map
def draw_heat_map():
    # Clean the data
    df_heat = df[(df['ap_lo'] <= df['ap_hi'])
                 & (df['height'] >= df['height'].quantile(0.025))
                 & (df['height'] <= df['height'].quantile(0.975))
                 & (df['weight'] >= df['weight'].quantile(0.025))
                 & (df['weight'] <= df['weight'].quantile(0.975))]

    # Calculate the correlation matrix
    corr = df_heat.corr()

    # Generate a mask for the upper triangle
    mask = np.ones_like(corr)
    mask[np.tril_indices_from(mask, k=-1)] = 0

    # Set up the matplotlib figure
    fig, ax = plt.subplots(figsize=(12, 9))

    # Draw the heatmap with 'sns.heatmap()'
    sns.heatmap(data=corr, mask=mask,
                ax=ax,    # heatmap returns an axe
                annot=True, fmt='.1f',
                center=0,
                vmin=-0.16, vmax=0.32,
                cbar_kws={'ticks': np.arange(-0.08, 0.32, 0.08)})

    # Do not modify the next two lines
    fig.savefig('heatmap.png')
    return fig
