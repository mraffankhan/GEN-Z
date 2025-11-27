import { supabase } from '../../lib/supabase'

export const uploadID = async (file, userId) => {
    try {
        // 1. Upload image to 'ids' bucket
        const fileExt = file.name.split('.').pop()
        const fileName = `${userId}.${fileExt}`
        const filePath = `${fileName}`

        const { error: uploadError } = await supabase.storage
            .from('ids')
            .upload(filePath, file, {
                upsert: true
            })

        if (uploadError) {
            throw uploadError
        }

        // 2. Get public URL
        const { data: { publicUrl } } = supabase.storage
            .from('ids')
            .getPublicUrl(filePath)

        // 3. Update profile
        const { error: updateError } = await supabase
            .from('profiles')
            .upsert({
                id: userId,
                verified: false,
                college: null,
                created_at: new Date().toISOString(),
                id_image_url: publicUrl // Now actually saving it
            })

        if (updateError) {
            throw updateError
        }

        return {
            success: true,
            message: 'ID uploaded successfully',
            id_image_url: publicUrl
        }

    } catch (error) {
        console.error('Upload error:', error)
        return {
            success: false,
            message: error.message,
            id_image_url: null
        }
    }
}
