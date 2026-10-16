import { NextResponse } from 'next/server';
import { 
  getServerLeaderboardEntry, 
  deleteServerLeaderboardEntry 
} from '@/lib/leaderboard-server';

/** GET /api/leaderboard/:id — 取得單筆排行榜紀錄 */
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const entry = getServerLeaderboardEntry(id);
    if (!entry) {
      return NextResponse.json(
        { success: false, message: '找不到該紀錄' },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: entry });
  } catch (err) {
    console.error('[API /leaderboard/:id] GET error:', err);
    return NextResponse.json(
      { success: false, message: '取得紀錄失敗' },
      { status: 500 }
    );
  }
}

/** DELETE /api/leaderboard/:id — 刪除伺服器端排行榜紀錄 */
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const success = deleteServerLeaderboardEntry(id);
    if (!success) {
      return NextResponse.json(
        { success: false, message: '找不到該紀錄' },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, message: '刪除成功' });
  } catch (err) {
    console.error('[API /leaderboard/:id] DELETE error:', err);
    return NextResponse.json(
      { success: false, message: '刪除失敗' },
      { status: 500 }
    );
  }
}
