export interface ParsedTime {
    year: number
    month: number
    day: number
    hour: number
    minute: number
}

export interface ParseResult {
    success: boolean
    formatted: string
    timestamp: number
    raw?: string
}

const MONTH_MAP: Record<string, number> = {
    '一': 1, '二': 2, '三': 3, '四': 4, '五': 5, '六': 6, '七': 7, '八': 8, '九': 9, '十': 10, '十一': 11, '十二': 12,
    '01': 1, '02': 2, '03': 3, '04': 4, '05': 5, '06': 6, '07': 7, '08': 8, '09': 9, '10': 10, '11': 11, '12': 12,
}

const WEEKDAY_MAP: Record<string, number> = {
    '日': 0, '一': 1, '二': 2, '三': 3, '四': 4, '五': 5, '六': 6,
    '周日': 0, '周一': 1, '周二': 2, '周三': 3, '周四': 4, '周五': 5, '周六': 6,
}

const parseMonth = (m: string): number => {
    const num = parseInt(m, 10)
    if (!isNaN(num) && num >= 1 && num <= 12) return num
    return MONTH_MAP[m] || 0
}

const parseDay = (d: string): number => {
    const num = parseInt(d.replace(/[号日]/g, ''), 10)
    return isNaN(num) ? 0 : num
}

const parseHour = (h: string, period: string): number => {
    let num = parseInt(h, 10)
    if (isNaN(num)) num = 0
    if (period === '下午' || period === '晚上' || period === '夜') {
        if (num < 12) num += 12
    } else if (period === '上午' || period === '早上') {
        if (num === 12) num = 0
    }
    return Math.min(23, Math.max(0, num))
}

const parseMinute = (m: string): number => {
    const num = parseInt(m, 10)
    return isNaN(num) ? 0 : Math.min(59, Math.max(0, num))
}

const extractTimeFromText = (text: string): ParseResult | null => {
    const now = new Date()
    const currentYear = now.getFullYear()
    const currentMonth = now.getMonth() + 1
    const currentDay = now.getDate()

    const patterns = [
        {
            regex: /(\d{4})[\-/年](\d{1,2})[\-/月](\d{1,2})[日号]?\s*[上下]?午?\s*(\d{1,2})[:：点时]\s*(\d{0,2})[分]?/,
            parse: (match: string[]) => ({
                year: parseInt(match[1]),
                month: parseMonth(match[2]),
                day: parseDay(match[3]),
                hour: parseHour(match[4], match[5] || ''),
                minute: parseMinute(match[5] || '0'),
            }),
        },
        {
            regex: /(\d{4})[\-/年](\d{1,2})[\-/月](\d{1,2})[日号]?/,
            parse: (match: string[]) => ({
                year: parseInt(match[1]),
                month: parseMonth(match[2]),
                day: parseDay(match[3]),
                hour: 0,
                minute: 0,
            }),
        },
        {
            regex: /(\d{1,2})[\-/月](\d{1,2})[日号]?\s*([上下]午)\s*(\d{1,2})[:：点时]\s*(\d{0,2})[分]?/,
            parse: (match: string[]) => ({
                year: currentYear,
                month: parseMonth(match[1]),
                day: parseDay(match[2]),
                hour: parseHour(match[4], match[3]),
                minute: parseMinute(match[5] || '0'),
            }),
        },
        {
            regex: /(\d{1,2})[\-/月](\d{1,2})[日号]?\s*(\d{1,2})[:：点时]\s*(\d{0,2})[分]?/,
            parse: (match: string[]) => ({
                year: currentYear,
                month: parseMonth(match[1]),
                day: parseDay(match[2]),
                hour: parseHour(match[3], ''),
                minute: parseMinute(match[4] || '0'),
            }),
        },
        {
            regex: /(\d{1,2})[\-/月](\d{1,2})[日号]?/,
            parse: (match: string[]) => ({
                year: currentYear,
                month: parseMonth(match[1]),
                day: parseDay(match[2]),
                hour: 0,
                minute: 0,
            }),
        },
        {
            regex: /([上下]午)\s*(\d{1,2})[:：点时]\s*(\d{0,2})[分]?/,
            parse: (match: string[]) => ({
                year: currentYear,
                month: currentMonth,
                day: currentDay,
                hour: parseHour(match[2], match[1]),
                minute: parseMinute(match[3] || '0'),
            }),
        },
        {
            regex: /(\d{1,2})[:：点时]\s*(\d{0,2})[分]?/,
            parse: (match: string[]) => ({
                year: currentYear,
                month: currentMonth,
                day: currentDay,
                hour: parseHour(match[1], ''),
                minute: parseMinute(match[2] || '0'),
            }),
        },
        {
            regex: /(今|明|后|昨)天?\s*([上下]午)?\s*(\d{1,2})[:：点时]?\s*(\d{0,2})[分]?/,
            parse: (match: string[]) => {
                let offset = 0
                switch (match[1]) {
                    case '今': offset = 0; break
                    case '明': offset = 1; break
                    case '后': offset = 2; break
                    case '昨': offset = -1; break
                }
                const targetDate = new Date(now.getTime() + offset * 24 * 60 * 60 * 1000)
                return {
                    year: targetDate.getFullYear(),
                    month: targetDate.getMonth() + 1,
                    day: targetDate.getDate(),
                    hour: parseHour(match[3] || '0', match[2] || ''),
                    minute: parseMinute(match[4] || '0'),
                }
            },
        },
        {
            regex: /本(周)?(周)?([日一二三四五六])\s*([上下]午)?\s*(\d{1,2})[:：点时]?\s*(\d{0,2})[分]?/,
            parse: (match: string[]) => {
                const targetDay = WEEKDAY_MAP[match[3]]
                if (targetDay === undefined) return null
                const currentWeekday = now.getDay()
                let diff = targetDay - currentWeekday
                if (diff <= 0) diff += 7
                const targetDate = new Date(now.getTime() + diff * 24 * 60 * 60 * 1000)
                return {
                    year: targetDate.getFullYear(),
                    month: targetDate.getMonth() + 1,
                    day: targetDate.getDate(),
                    hour: parseHour(match[5] || '0', match[4] || ''),
                    minute: parseMinute(match[6] || '0'),
                }
            },
        },
    ]

    for (const { regex, parse } of patterns) {
        const match = text.match(regex)
        if (match) {
            const result = parse(match)
            if (result && result.month >= 1 && result.month <= 12 && result.day >= 1 && result.day <= 31) {
                const date = new Date(result.year, result.month - 1, result.day, result.hour, result.minute)
                if (!isNaN(date.getTime())) {
                    return {
                        success: true,
                        formatted: formatDateTime(date),
                        timestamp: date.getTime(),
                        raw: match[0],
                    }
                }
            }
        }
    }

    return null
}

export const formatDateTime = (date: Date): string => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hour = String(date.getHours()).padStart(2, '0')
    const minute = String(date.getMinutes()).padStart(2, '0')
    return `${year}-${month}-${day} ${hour}:${minute}`
}

export const parseTimeText = (text: string): ParseResult => {
    if (!text || typeof text !== 'string') {
        return { success: false, formatted: '', timestamp: 0 }
    }

    const trimmed = text.trim()
    if (!trimmed) {
        return { success: false, formatted: '', timestamp: 0 }
    }

    const extracted = extractTimeFromText(trimmed)
    if (extracted) {
        return extracted
    }

    return { success: false, formatted: '', timestamp: 0 }
}

export const formatTimeForPicker = (timestamp: number): string => {
    if (!timestamp || isNaN(timestamp)) return ''
    const date = new Date(timestamp)
    return formatDateTime(date)
}

export const parsePickerValue = (value: string): number => {
    if (!value) return 0
    const match = value.match(/(\d{4})-(\d{2})-(\d{2})\s+(\d{2}):(\d{2})/)
    if (match) {
        const date = new Date(
            parseInt(match[1]),
            parseInt(match[2]) - 1,
            parseInt(match[3]),
            parseInt(match[4]),
            parseInt(match[5])
        )
        return date.getTime()
    }
    return 0
}