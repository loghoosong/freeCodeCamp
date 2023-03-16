import os
import numpy as np
import matplotlib.pyplot as plt
import pandas as pd
import seaborn as sns
from pandas.plotting import register_matplotlib_converters
register_matplotlib_converters()

# Import data (Make sure to parse dates. Consider setting index column to 'date'.)
df = pd.read_csv(
    os.getcwd() + r'\DataAnalysisWithPython\fcc-forum-pageviews.csv', index_col='date')
# df = pd.read_csv('fcc-forum-pageviews.csv', index_col='date')

# Clean data
df = df[(df['value'] >= df['value'].quantile(0.025))
        & (df['value'] <= df['value'].quantile(0.975))]
df.index = pd.to_datetime(df.index)


def draw_line_plot():
    # Draw line plot
    fig, ax = plt.subplots(figsize=(20, 9))
    ax.set_title('Daily freeCodeCamp Forum Page Views 5/2016-12/2019')
    ax.set_xlabel('Date')
    ax.set_ylabel('Page Views')
    ax.plot(df, 'r')

    # Save image and return fig (don't change this part)
    fig.savefig('line_plot.png')
    return fig


def draw_bar_plot():
    # Copy and modify data for monthly bar plot
    missing_data = pd.DataFrame({'value': [0, 0, 0, 0]},
                                index=pd.to_datetime(['2016-01-01', '2016-02-01', '2016-03-01', '2016-04-01']))

    df_bar = df.resample('M').mean()
    df_bar = pd.concat([missing_data, df_bar])
    '''year_list = np.arange(df_bar.index[0].year, df_bar.index[-1].year + 1).tolist()'''
    df_bar = df_bar.groupby(lambda x: x.month)

    # Draw bar plot
    width = 0.04
    '''本来是通过这个函数计算x的 但是测试要求必须补全月份数据
    def cal_x(index, month):
        x = []
        for year in index:
            x.append(year_list.index(year.year) + (month - 6.5) * width)
        return x
    '''
    def get_month_name(num):
        month = ('January', 'February', 'March', 'April', 'May', 'June',
                 'July', 'August', 'September', 'October', 'November', 'December')
        return month[num-1]

    x = np.arange(4)
    fig, ax = plt.subplots(figsize=(16, 9))
    for month, data in df_bar:
        ax.bar(x + (month - 6.5) * width, data['value'],
               width, label=get_month_name(month))

    ax.set_xticks(x, [2016, 2017, 2018, 2019])
    ax.set_xlabel('Years')
    ax.set_ylabel('Average Page Views')
    ax.legend()
    # Save image and return fig (don't change this part)
    fig.savefig('bar_plot.png')
    return fig


def draw_box_plot():
    # Prepare data for box plots (this part is done!)
    df_box = df.copy()
    df_box.reset_index(inplace=True)
    df_box['Year'] = [d.year for d in df_box.date]
    df_box['Month'] = [d.strftime('%b') for d in df_box.date]

    # Draw box plots (using Seaborn)
    fig, ax = plt.subplots(1, 2, figsize=(32, 9))
    sns.boxplot(x=df_box['Year'], y=df_box['value'],
                ax=ax[0])
    sns.boxplot(x=df_box['Month'], y=df_box['value'],
                ax=ax[1],
                order=['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                       'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'])
    ax[0].set_title('Year-wise Box Plot (Trend)')
    ax[1].set_title('Month-wise Box Plot (Seasonality)')
    ax[0].set_ylabel('Page Views')
    ax[1].set_ylabel('Page Views')

    # Save image and return fig (don't change this part)
    fig.savefig('box_plot.png')
    return fig
